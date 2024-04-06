import {MessageType, SocketStatus, User} from "@defferrard/algoo-core/src/socket";
import {Player} from "@defferrard/algoo-core/src/game";
import {Server, Socket} from 'socket.io';
import {LOGGER} from "../utils/logger";
import {gameRoomRepository} from "../repositories";


export default class SocketUser extends User {

    #socket: Socket;
    #rooms: { [key: string]: string } = {}; // Key = Room UUID, Value = Player UUID

    constructor(user: User, socket: Socket) {
        super(user.uuid, user.name);
        this.#socket = socket;
    }

    buildRoutes(server: Server): void {
        this.#socket
            .on(MessageType.GAME_ROOM_JOIN, ({roomUuid, player}: { roomUuid: string, player: Player }, callback) => {
                LOGGER.info(`Socket ${this.uuid} joined room ${roomUuid}`);
                this.#socket.join(roomUuid);
                try {
                    gameRoomRepository.addPlayer(roomUuid, player);
                    this.#socket.to(roomUuid).emit(MessageType.GAME_ROOM_JOIN, player);
                    this.#rooms[roomUuid] = player.user.uuid;
                    callback({status: SocketStatus.OK, data: gameRoomRepository.get(roomUuid).players});
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
            }).on(MessageType.GAME_ROOM_READY, ({roomUuid, isReady}: { roomUuid: string, isReady: boolean }) => {
            LOGGER.info(`Socket ${this.uuid} is${isReady ? " " : " not "}ready `);
            let gameRoomReady: boolean = gameRoomRepository.setPlayerReady(roomUuid, this.uuid, isReady);
            server.to(roomUuid).emit(MessageType.GAME_ROOM_READY, {
                from: this.getPlayer(roomUuid),
                isReady
            });
            if (gameRoomReady) {
                server.to(roomUuid).emit(MessageType.GAME_ROOM_STARTING, gameRoomRepository.startGame(roomUuid,
                    (data) => {
                        server.to(roomUuid).emit(MessageType.GAME_ROOM_START, data);
                    }));
            }
        }).onAny((event, ...args) => {
            LOGGER.info(`Socket ${this.uuid} sent event ${event}`);
        });
    }

    leaveRoom(roomUuid: string) {
        LOGGER.info(`Socket ${this.uuid} left room ${roomUuid}`);
        let player = this.getPlayer(roomUuid);
        this.#socket.leave(roomUuid);
        if (!this.#rooms[roomUuid]) return;
        gameRoomRepository.removePlayer(roomUuid, this.uuid);
        delete this.#rooms[roomUuid];
        this.#socket.to(roomUuid).emit(MessageType.GAME_ROOM_LEAVE, player);
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

    getPlayer(roomUuid: string): Player | undefined {
        return gameRoomRepository.get(roomUuid).getPlayer(this.uuid);
    }

    get socket(): Socket {
        return this.#socket;
    }

    set socket(socket: Socket) {
        this.#socket = socket;
    }
}