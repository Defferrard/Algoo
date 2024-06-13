import { socket } from '$lib/stores/socket';
import type { MessageType } from '@defferrard/algoo-core/src/socket';

type event = { message: MessageType; handler: Function };

export function On(eventName: MessageType) {
  return function (target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
    const event: event = {
      message: eventName,
      handler: descriptor.value,
    };
    if (!target.events) target.events = [];
    target.events.push(event);
    return descriptor;
  };
}

export function SocketController() {
  return function <T extends { new (...args: any[]): {} }>(clazz: T) {
    return class extends clazz {
      constructor(...args: any[]) {
        super(...args);
        const events: event[] = (this as any).events || [];
        for (const event of events) {
          socket.on(event.message, event.handler.bind(this));
        }
      }
    };
  };
}
