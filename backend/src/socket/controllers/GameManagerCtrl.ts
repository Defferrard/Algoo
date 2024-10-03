import { CastSpellDTO, MoveEntityDTO } from '@defferrard/algoo-core/src/dto';
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

  @OnMessage(MessageType.CAST_SPELL)
  castSpell(@ConnectedSocket() socket: Socket, @MessageBody() payload: CastSpellDTO) {
    LOGGER.info(`Socket ${socket.id} cast spell`, payload);
    this.service.castSpell(socket, payload);
  }

  @OnMessage(MessageType.MOVE_ENTITY)
  moveEntity(@ConnectedSocket() socket: Socket, @MessageBody() payload: MoveEntityDTO) {
    LOGGER.info(`Socket ${socket.id} move entity`, payload);
    this.service.moveEntity(socket, payload);
  }
}
