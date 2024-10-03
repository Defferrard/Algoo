import { ChatMessageDTO, IsReadyMessageDTO } from '@defferrard/algoo-core/src/dto';
import { MessageType, User } from '@defferrard/algoo-core/src/socket';
import { assertNonNull } from '@defferrard/algoo-core/src/utils/assertions';
import { isUUID } from 'class-validator';
import { Request } from 'express';
import {
  ConnectedSocket,
  EmitOnSuccess,
  MessageBody,
  NspParam,
  NspParams,
  OnConnect,
  OnDisconnect,
  OnMessage,
  SocketController,
  SocketRequest,
} from 'socket-controllers';
import { Socket } from 'socket.io';
import { Service } from 'typedi';
import GameRoomService from '~/services/GameRoomService';
import { LOGGER } from '~/utils/logger';

const GAME_ROOM_UUID = 'gameRoomUUID';

@Service()
@SocketController(`/rooms/:${GAME_ROOM_UUID}`)
export class GameRoomCtrl {
  constructor(public service: GameRoomService) {}

  @OnConnect()
  @EmitOnSuccess(MessageType.PUT_GAME_ROOM)
  onJoinRoom(@ConnectedSocket() socket: Socket, @SocketRequest() req: Request, @NspParam(GAME_ROOM_UUID) room: string) {
    if (!isUUID(room)) {
      return socket.disconnect();
    }
    LOGGER.info(`Socket ${socket.id} connected`);
    assertNonNull(req.user);
    const user: User = req.user as User;
    return this.service.joinRoom(socket, user, room);
  }

  @OnDisconnect()
  onLeaveRoom(@ConnectedSocket() socket: Socket) {
    this.service.leaveRoom(socket);
    LOGGER.info(`Socket ${socket.id} disconnected`);
  }

  @OnMessage(MessageType.GAME_ROOM_MESSAGE)
  async onMessage(@ConnectedSocket() socket: Socket, @MessageBody() dto: ChatMessageDTO) {
    LOGGER.info(`Socket ${socket.id} sent message ${dto.message}`);
    await this.service.sendMessage(socket, dto);
  }

  @OnMessage(MessageType.GAME_ROOM_READY)
  onReady(@ConnectedSocket() socket: Socket, @MessageBody() dto: IsReadyMessageDTO) {
    LOGGER.info(`Socket ${socket.id} is ready: ${dto.isReady}`);
    this.service.isReady(socket, dto.isReady);
  }
}
