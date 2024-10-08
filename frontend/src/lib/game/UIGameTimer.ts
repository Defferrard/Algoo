import { GameTimer } from '@defferrard/algoo-core/src/game';
import type { Readable, Writable } from 'svelte/store';
import { writable } from 'svelte/store';

export default class UIGameTimer extends GameTimer {
  private readonly _percentage: Writable<number>;

  constructor() {
    super();
    this._percentage = writable(0);
  }

  protected onTick(now: number) {
    super.onTick(now);
    this._percentage.set(((now - super.last) / (super.next - super.last)) * 100);
  }

  get percentage(): Readable<number> {
    return { subscribe: this._percentage.subscribe };
  }
}
