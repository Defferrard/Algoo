import { SimpleCoordinate } from '@defferrard/algoo-core/src/board';
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

  castSpell({ data: { room, player } }: PlayerSocket, payload: { x: number; y: number; spellIndex: number }) {
    this.socketRepository.broadcast(room, MessageType.CAST_SPELL, payload);
  }

  moveEntity({ data: { room, player } }: PlayerSocket, payload: { path: SimpleCoordinate[] }) {
    this.socketRepository.broadcast(room, MessageType.MOVE_ENTITY, payload);
  }
}
