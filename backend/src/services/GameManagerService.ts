import { SimpleCoordinate } from '@defferrard/algoo-core/src/board';
import { CastSpellDTO, MoveEntityDTO } from '@defferrard/algoo-core/src/dto';
import { MessageType, User } from '@defferrard/algoo-core/src/socket';
import { Service } from 'typedi';
import { GameRoomRepository, SocketRepository } from '~/repositories';
import PlayerSocket from '~/socket/sockets/PlayerSocket';

@Service()
export default class GameRoomService {
  constructor(
    public gameRoomRepository: GameRoomRepository,
    public socketRepository: SocketRepository,
  ) {}

  nextTurn({ data: { room, player } }: PlayerSocket) {
    this.socketRepository.broadcast(room, MessageType.NEXT_TURN);
  }

  castSpell({ data: { room, player } }: PlayerSocket, payload: CastSpellDTO) {
    this.socketRepository.broadcast(room, MessageType.CAST_SPELL, payload);
  }

  moveEntity({ data: { room, player } }: PlayerSocket, payload: MoveEntityDTO) {
    this.socketRepository.broadcast(room, MessageType.MOVE_ENTITY, payload);
  }
}
