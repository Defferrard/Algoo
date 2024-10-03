import { EventLifecycle, socket } from '$lib/stores/socket';
import { de } from '@faker-js/faker';
import {
  type Invalidator,
  type Readable,
  type Subscriber,
  type Unsubscriber,
  type Writable,
  writable,
} from 'svelte/store';

export abstract class Observable<T> implements Readable<T> {
  private store: Writable<T>;

  constructor() {
    this.store = writable(this.getObservable());
  }

  subscribe(run: Subscriber<T>, invalidate?: Invalidator<T> | undefined): Unsubscriber {
    return this.store.subscribe(run, invalidate);
  }

  register() {
    socket.onLifeCycle(EventLifecycle.POST_HANDLER, this.notify.bind(this));
  }

  protected notify() {
    this.store.set(this.getObservable());
  }

  protected abstract getObservable(): T;
}
