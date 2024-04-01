import {MessageType, SocketStatus, User} from "@defferrard/algoo-core/src/socket";
import {Server, Socket} from 'socket.io';
import {LOGGER} from "../utils/logger";
import {GameRoom, Player} from "../game";
import {gameRoomRepository} from "../repositories";

export default class SocketUser extends User {

    #socket: Socket;

    constructor(user: User, socket: Socket) {
        super(user.uuid, user.name);
        this.#socket = socket;
    }

    buildRoutes(server: Server) {
        this.#socket
            .on(MessageType.GAME_ROOM_JOIN, (room: string, callback) => {
                LOGGER.info(`Socket ${this.uuid} joined room ${room}`);
                this.#socket.join(room);
                const PLAYER = new Player(this);
                try {
                    let gameRoom: GameRoom = gameRoomRepository.get(room)!;
                    gameRoom.addPlayer(PLAYER);
                    this.#socket.to(room).emit(MessageType.GAME_ROOM_JOIN, this);
                    callback({status: SocketStatus.OK, data: gameRoom.users});
                } catch (e) {
                    callback({status: SocketStatus.FAILED, data: e});
                }
            })
            .on(MessageType.GAME_ROOM_LEAVE, (room: string) => this.leaveRoom(room))
            .on(MessageType.GAME_ROOM_MESSAGE, ({room, message}) => {
                LOGGER.info(`Socket ${this.uuid} sent message ${message}`);
                server.to(room).emit(MessageType.GAME_ROOM_MESSAGE, {
                    datetime: new Date(),
                    from: this,
                    message
                });
            }).on(MessageType.GAME_ROOM_READY, (isReady: boolean) => {
                LOGGER.info(`Socket ${this.uuid} is${isReady?" ":" not "}ready `);

            }).onAny((event, ...args) => {
                LOGGER.info(`Socket ${this.uuid} sent event ${event}`);
            });
    }

    leaveRoom(room: string) {
        LOGGER.info(`Socket ${this.uuid} left room ${room}`);
        this.#socket.leave(room);
        let gameRoom: GameRoom | undefined = gameRoomRepository.get(room);
        if (!gameRoom) return;
        gameRoom.removePlayer(this.uuid);
        this.#socket.to(room).emit(MessageType.GAME_ROOM_LEAVE, this);
    }

    get socket(): Socket {
        return this.#socket;
    }

    set socket(socket: Socket) {
        this.#socket = socket;
    }
}