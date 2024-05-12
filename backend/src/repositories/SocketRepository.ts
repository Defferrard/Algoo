import {Service} from "typedi";
import {Server, Socket} from "socket.io";
import {User} from "@defferrard/algoo-core/src/socket";


export const SOCKET_ROOM_PREFIX = 'user:';

@Service()
export class SocketRepository {

    constructor(
        public io: Server
    ) {
    }

    save(socket: Socket, user: User) {
        socket.join(SOCKET_ROOM_PREFIX + user.uuid);
    }

    emitTo(uuid: string) {
        return this.io.to(SOCKET_ROOM_PREFIX + uuid).emit
    }

    isConnected(uuid: string): boolean {
        return false;
    }
}