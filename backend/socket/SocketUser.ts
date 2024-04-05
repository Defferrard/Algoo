import {MessageType, SocketStatus, User} from "@defferrard/algoo-core/src/socket";
import {Player} from "@defferrard/algoo-core/src/game";
import {Server, Socket} from 'socket.io';
import {LOGGER} from "../utils/logger";
import {GameRoom} from "../game";
import {gameRoomRepository} from "../repositories";


export default class SocketUser extends User {

    #socket: Socket;
    #rooms: { [key: string]: GameRoom } = {};

    constructor(user: User, socket: Socket) {
        super(user.uuid, user.name);
        this.#socket = socket;
    }

    buildRoutes(server: Server) {
        this.#socket
            .on(MessageType.GAME_ROOM_JOIN, ({room, player}: { room: string, player: Player }, callback) => {
                LOGGER.info(`Socket ${this.uuid} joined room ${room}`);
                this.#socket.join(room);
                try {
                    let gameRoom: GameRoom = gameRoomRepository.get(room)!;
                    gameRoom.addPlayer(player);
                    this.#socket.to(room).emit(MessageType.GAME_ROOM_JOIN, player);
                    this.#rooms[room] = gameRoom;
                    callback({status: SocketStatus.OK, data: gameRoom.players});
                } catch (e: any) {
                    callback({status: SocketStatus.FAILED, data: {message: e.message}});
                }
            })
            .on(MessageType.GAME_ROOM_LEAVE, (room: string) => this.leaveRoom(room))
            .on(MessageType.GAME_ROOM_MESSAGE, ({room, message}: { room: string, message: string }) => {
                LOGGER.info(`Socket ${this.uuid} sent message ${message}`);
                server.to(room).emit(MessageType.GAME_ROOM_MESSAGE, {
                    datetime: new Date(),
                    from: this.getPlayer(room),
                    message
                });
            }).on(MessageType.GAME_ROOM_READY, ({room, isReady}: { room: string, isReady: boolean }) => {
            LOGGER.info(`Socket ${this.uuid} is${isReady ? " " : " not "}ready `);
            let gameRoomReady: boolean = this.#rooms[room].setPlayerReady(this.uuid, isReady);
            server.to(room).emit(MessageType.GAME_ROOM_READY, {
                from: this.getPlayer(room),
                isReady
            });
            if (gameRoomReady) {
                server.to(room).emit(MessageType.GAME_ROOM_STARTING, this.#rooms[room].startGame((data)=>{
                    server.to(room).emit(MessageType.GAME_ROOM_START, data);
                }));
            }
        }).onAny((event, ...args) => {
            LOGGER.info(`Socket ${this.uuid} sent event ${event}`);
        });
    }

    leaveRoom(room: string) {
        LOGGER.info(`Socket ${this.uuid} left room ${room}`);
        let player = this.getPlayer(room);
        this.#socket.leave(room);
        if (!this.#rooms[room]) return;
        this.#rooms[room].removePlayer(this.uuid);
        delete this.#rooms[room];
        this.#socket.to(room).emit(MessageType.GAME_ROOM_LEAVE, player);
    }

    leaveAllRooms() {
        for (const room in this.#rooms) {
            this.leaveRoom(room);
        }
    }

    disconnect() {
        this.leaveAllRooms();
        this.#socket.disconnect(true);
    }

    getPlayer(room: string): Player | undefined {
        return this.#rooms[room]?.getPlayer(this.uuid);
    }

    get socket(): Socket {
        return this.#socket;
    }

    set socket(socket: Socket) {
        this.#socket = socket;
    }
}