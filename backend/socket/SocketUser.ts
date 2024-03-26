import {MessageType, User} from "@defferrard/algoo-core/src/socket";
import {Server, Socket} from 'socket.io';
import {LOGGER} from "../utils/logger";
import {Player} from "../game";
import {gameRoomRepository} from "../repositories";

export default class SocketUser extends User {

    #socket: Socket;

    constructor(user: User, socket: Socket) {
        super(user.uuid, user.name);
        this.#socket = socket;
    }

    buildRoutes(server: Server) {
        this.#socket
            .on(MessageType.GAME_ROOM_JOIN, (room: string) => {
                LOGGER.info(`Socket ${this.uuid} joined room ${room}`);
                this.#socket.join(room);
                const PLAYER = new Player(this)
                gameRoomRepository.get(room)!.addPlayer(PLAYER);
                this.#socket.to(room).emit(MessageType.GAME_ROOM_JOIN, PLAYER);
            })
            .on(MessageType.GAME_ROOM_MESSAGE, ({room, message}) => {
            LOGGER.info(`Socket ${this.uuid} sent message ${message}`);
            server.to(room).emit(MessageType.GAME_ROOM_MESSAGE, {
                datetime: new Date(),
                from: this,
                message
            });
        });
    }

    get socket(): Socket {
        return this.#socket;
    }

    set socket(socket: Socket) {
        this.#socket = socket;
    }
}