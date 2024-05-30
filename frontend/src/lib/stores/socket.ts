import type { MessageType } from '@defferrard/algoo-core/src/socket';
import { Socket, io } from 'socket.io-client';
import { writable } from 'svelte/store';

export const socket = (() => {
  let socketIO: Socket | undefined;
  const { subscribe, set, update } = writable<Socket | undefined>(socketIO);
  let pendingRoutes: { type: MessageType; listener: (...args: any[]) => void }[] = [];

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

    for (const route of pendingRoutes) {
      socketIO.on(route.type, route.listener);
    }
    pendingRoutes = [];

    socketIO.connect();

    set(socketIO);
  }

  function on(type: MessageType, listener: (...args: any[]) => void) {
    if (socketIO) {
      socketIO.on(type, listener);
    } else {
      pendingRoutes = [...pendingRoutes, { type, listener }];
    }
  }

  return {
    connect,
    disconnect: () => socketIO?.disconnect(),
    subscribe,
    get: () => socketIO,
    emit: (type: MessageType, data?: any, ack?: (data: any) => void) => socketIO!.emit(type, data, ack),
    on,
  };
})();
