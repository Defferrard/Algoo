import { socket } from '$lib/stores/socket';
import type { MessageType } from '@defferrard/algoo-core/src/socket';
import 'reflect-metadata';

const METADATA_ON_EVENT_KEY = 'algoo:anotations:on';
export type event = { message: MessageType; handler: Function };
export type SocketControllerClass = { events?: event[] };

export function On(eventName: MessageType) {
  return function (target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
    const event: event = {
      message: eventName,
      handler: descriptor.value,
    };
    Reflect.defineMetadata(METADATA_ON_EVENT_KEY, event, target, _propertyKey);
    return descriptor;
  };
}

export function SocketController() {
  return function <T extends { new (...args: any[]): {} }>(clazz: T) {
    return class extends clazz {
      constructor(...args: any[]) {
        super(...args); // Call the original constructor
        // For each properties of the class
        for (const propertyName of Object.getOwnPropertyNames(clazz.prototype)) {
          const descriptor = Object.getOwnPropertyDescriptor(clazz.prototype, propertyName);
          // If the property is a function
          if (descriptor && typeof descriptor.value === 'function') {
            // Check if the function has the @On Event decorator from the metadata
            const metadata = Reflect.getMetadata(METADATA_ON_EVENT_KEY, this, propertyName);
            if (metadata && metadata.message && metadata.handler) {
              const event: event = metadata;
              // Bind the function to the class instance
              socket.on(event.message, event.handler.bind(this));
            }
          }
        }
      }
    };
  };
}
