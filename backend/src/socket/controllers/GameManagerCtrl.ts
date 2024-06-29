import { MessageType } from '@defferrard/algoo-core/src/socket';
import { ConnectedSocket, MessageBody, OnMessage, SocketController } from 'socket-controllers';
import { Socket } from 'socket.io';
import { Service } from 'typedi';
import GameManagerService from '~/services/GameManagerService';
import { LOGGER } from '~/utils/logger';

const GAME_ROOM_UUID = 'gameRoomUUID';

@Service()
@SocketController(`/rooms/:${GAME_ROOM_UUID}`)
export class GameManagerCtrl {
  constructor(public service: GameManagerService) {}

  @OnMessage(MessageType.NEXT_TURN)
  nextTurn(@ConnectedSocket() socket: Socket) {
    LOGGER.info(`Socket ${socket.id} passed turn`);
    this.service.nextTurn(socket);
  }

  @OnMessage(MessageType.ACTION)
  action(@ConnectedSocket() socket: Socket, @MessageBody() payload: { x: number; y: number; spellIndex?: number }) {
    LOGGER.info(`Socket ${socket.id} action`, payload);
    this.service.action(socket, payload);
  }
}
