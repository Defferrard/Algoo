import { User } from '@defferrard/algoo-core/src/socket';
import { Socket } from 'socket.io';

export default interface ConnectedSocket extends Socket {
  data: {
    user: User;
  };
}