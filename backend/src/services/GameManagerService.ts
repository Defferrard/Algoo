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

  action({ data: { room, player } }: PlayerSocket, payload: { x: number; y: number; spellIndex?: number }) {
    this.socketRepository.broadcast(room, MessageType.ACTION, payload);
  }
}
