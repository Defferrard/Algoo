export default class ActionBuffer {
  private readonly _actions: (() => Promise<void>)[];
  private _running: boolean;

  onFinished: () => void;

  constructor() {
    this._actions = [];
    this._running = false;
    this.onFinished = () => {};
  }

  add(action: () => Promise<void>) {
    this._actions.push(action);
    if (!this._running) this.start();
  }

  get running() {
    return this._running;
  }

  private async start() {
    this._running = true;
    while (this._actions.length > 0) {
      const ACTION: () => Promise<void> = this._actions.shift()!;
      await ACTION();
    }
    this._running = false;
    this.onFinished();
  }
}
