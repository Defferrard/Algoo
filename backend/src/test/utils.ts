import { Socket as SocketServer } from 'socket.io';
import { Socket as SocketClient } from 'socket.io-client';

export async function socketOnce(socket: SocketClient | SocketServer, event: string): Promise<any> {
  return new Promise((resolve) => {
    socket.once(event, resolve);
  });
}
