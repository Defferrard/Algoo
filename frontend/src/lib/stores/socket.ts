import type { MessageType } from '@defferrard/algoo-core/src/socket';
import { io, Socket } from 'socket.io-client';
import { writable } from 'svelte/store';

export const socket = (() => {
  let socketIO: Socket | undefined;
  const { subscribe, set, update } = writable<Socket | undefined>(socketIO);

  function connect(room: string, jwt: string): void {
    socketIO = io(`/rooms/${room}`, {
      autoConnect: false,
      extraHeaders: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    socketIO.onAny((event, ...args) => {
      console.log(event, args);
      set(socketIO);
    });

    socketIO.connect();
    set(socketIO);
  }

  return {
    connect,
    disconnect: () => socketIO?.disconnect(),
    subscribe,
    get: () => socketIO,
    emit: (type: MessageType, data?: any, ack?: (data: any) => void) => socketIO!.emit(type, data, ack),
    on: function(type: MessageType, listener: (...args: any[]) => void) {
      socketIO!.on(type, listener);
    },
  };
})();