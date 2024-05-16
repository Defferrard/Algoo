import { SocketRepository } from '$/repositories';
import { LOGGER } from '$/utils/logger';
import { MessageType, User } from '@defferrard/algoo-core/src/socket';
import { Request } from 'express';
import {
  ConnectedSocket,
  MessageAck,
  OnMessage,
  SocketRequest,
} from 'socket-controllers';
import { Socket } from 'socket.io';
import {
  DefaultEventsMap,
  StrictEventEmitter,
} from 'socket.io/dist/typed-events';

export abstract class BasicCtrl {
  protected constructor(public socketRepository: SocketRepository) {
  }

  // onConnect is undecorated because it should be called by the child class
  protected onConnect(@ConnectedSocket() socket: Socket, @SocketRequest() req: Request): void {
    LOGGER.info(`Socket ${socket.id} connected`);
    const USER: User = req.user! as User;
    this.socketRepository.save(socket, USER);
  }

  @OnMessage(MessageType.WHO_AM_I)
  getSession(@ConnectedSocket() socket: Socket, @MessageAck() ack: (user: User) => void) {
    ack(socket.data.user);
  }

  protected onDisconnect(@ConnectedSocket() socket: Socket): void {
    LOGGER.info(`Socket ${socket.id} disconnected`);
  }

  broadcast(
    io: StrictEventEmitter<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>,
    event: MessageType,
    message: any,
  ): void {
    io.emit(event, message);
  }
}