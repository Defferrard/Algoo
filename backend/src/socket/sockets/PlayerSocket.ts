import { Player } from '@defferrard/algoo-core/src/game';
import { Socket } from 'socket.io';

export default interface PlayerSocket extends Socket {
  data: {
    player: Player;
    room: string;
  };
}