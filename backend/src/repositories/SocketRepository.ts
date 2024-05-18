import { MessageType, User } from '@defferrard/algoo-core/src/socket';
import { Server, Socket } from 'socket.io';
import { Service } from 'typedi';


export const SOCKET_ROOM_PREFIX = 'user:';

@Service()
export class SocketRepository {

  constructor(
    public io: Server,
  ) {
  }

  save(socket: Socket, user: User) {
    socket.data.user = user;
    socket.join(SOCKET_ROOM_PREFIX + user.uuid);
  }

  broadcast(room: string, event: MessageType, message: any = '') {
    this.io.of(`/rooms/${room}`).emit(event, message);
  }
}