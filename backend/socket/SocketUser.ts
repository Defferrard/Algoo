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
                    this.#socket.to(room).emit(MessageType.GAME_ROOM_JOIN, PLAYER);
                    callback({status: SocketStatus.OK, data: gameRoom.users});
                } catch (e) {
                    callback({status: SocketStatus.FAILED, data: e});
                }
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