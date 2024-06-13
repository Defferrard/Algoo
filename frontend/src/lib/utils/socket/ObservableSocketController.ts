import { EventLifecycle, socket } from '$lib/stores/socket';
import type { MessageType } from '@defferrard/algoo-core/src/socket';
import { th } from '@faker-js/faker';
import {
  type Invalidator,
  type Readable,
  type Subscriber,
  type Unsubscriber,
  type Writable,
  writable,
} from 'svelte/store';

export abstract class ObservableSocketController<T> implements Readable<T> {
  private store: Writable<T>;
  private events: { message: MessageType; handler: Function }[];

  constructor() {
    this.store = writable(this.getObservable());
    this.events = [];
  }

  subscribe(run: Subscriber<T>, invalidate?: Invalidator<T> | undefined): Unsubscriber {
    return this.store.subscribe(run, invalidate);
  }

  register() {
    for (const event of this.events) {
      socket.on(event.message, event.handler.bind(this));
    }

    socket.onLifeCycle(EventLifecycle.POST_HANDLER, this.notify.bind(this));
  }

  protected notify() {
    this.store.set(this.getObservable());
  }

  protected abstract getObservable(): T;
}
