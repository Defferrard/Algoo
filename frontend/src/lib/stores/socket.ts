import type { MessageType } from '@defferrard/algoo-core/src/socket';
import { Socket, io } from 'socket.io-client';
import { writable } from 'svelte/store';

type LifecycleFunction = (type: MessageType, ...args: any[]) => void;
export enum EventLifecycle {
  PRE_HANDLER = 'preHandler',
  POST_HANDLER = 'postHandler',
}

export const socket = (() => {
  let socketIO: Socket | undefined;
  const { subscribe, set, update } = writable<Socket | undefined>(socketIO);
  let routes: { [key in MessageType]?: ((...args: any[]) => void)[] } = {};
  const lifeCycle: { [key in EventLifecycle]: LifecycleFunction[] } = {
    [EventLifecycle.PRE_HANDLER]: [],
    [EventLifecycle.POST_HANDLER]: [],
  };

  function connect(room: string, jwt: string): void {
    socketIO = io(`/rooms/${room}`, {
      autoConnect: false,
      extraHeaders: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    socketIO.onAny((event: MessageType, ...args) => {
      console.log(event, args);
      for (const preHandler of lifeCycle[EventLifecycle.PRE_HANDLER]) {
        preHandler(event, ...args);
      }
      routes[event]?.forEach((listener) => listener(...args));
      for (const postHandler of lifeCycle[EventLifecycle.POST_HANDLER]) {
        postHandler(event, ...args);
      }
      set(socketIO);
    });

    socketIO.connect();
    set(socketIO);
  }

  function on(type: MessageType, listener: (...args: any[]) => void) {
    if (!routes[type]) {
      routes[type] = [];
    }
    routes[type]?.push(listener);
  }

  function onLifeCycle(eventLifeCycle: EventLifecycle, handler: LifecycleFunction): () => void {
    lifeCycle[eventLifeCycle].push(handler);
    return () => {
      lifeCycle[eventLifeCycle] = lifeCycle[eventLifeCycle].filter((h) => h !== handler);
    };
  }

  return {
    connect,
    disconnect: () => {
      routes = {};
      socketIO?.disconnect();
      set(socketIO);
    },
    subscribe,
    get: () => socketIO,
    emit: (type: MessageType, data?: any, ack?: (data: any) => void) => socketIO!.emit(type, data, ack),
    on,
    onLifeCycle,
  };
})();
