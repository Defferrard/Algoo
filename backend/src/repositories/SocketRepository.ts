import { DTO } from '@defferrard/algoo-core/src/dto';
import { MessageType, User } from '@defferrard/algoo-core/src/socket';
import { Server, Socket } from 'socket.io';
import { Service } from 'typedi';
import { LOGGER } from '~/utils/logger';

export const SOCKET_ROOM_PREFIX = 'user:';

@Service()
export class SocketRepository {
  constructor(public io: Server) {}

  save(socket: Socket, user: User) {
    socket.data.user = user;
    socket.join(SOCKET_ROOM_PREFIX + user.uuid);
  }

  async broadcast(room: string, event: MessageType, dto?: DTO) {
    try {
      if (dto && dto instanceof DTO) {
        await dto.validateOrReject();
      }
      this.io.of(`/rooms/${room}`).emit(event, dto);
    } catch (e) {
      LOGGER.error(e);
    }
  }
}
