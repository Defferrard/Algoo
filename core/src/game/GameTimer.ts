export default class GameTimer {

    turnTime: number;
    intervalTime: number;
    private _last: number;
    private _next: number;

    private _interval: any;
    private _callback?: () => void;

    constructor() {
        this._last = Date.now();
        this._next = this._last;
        this.turnTime = 20000;
        this.intervalTime = 100;
    }

    start(callback: () => void) {
        if (this._interval) clearInterval(this._interval);
        this._callback = callback;
        this._last = Date.now();
        this._next = this._last + this.turnTime;
        this._interval = setInterval(this.getTick(), this.intervalTime);
    }

    stop() {
        clearInterval(this._interval);
        this._interval = undefined;
        this._callback = undefined;
    }

    restart(callback: () => void) {
        this.stop();
        this.start(callback);
    }

    protected get last() {
        return this._last;
    }

    protected get next() {
        return this._next;
    }

    protected onTick(now: number) {
        if (now > this._next) {
            this._callback!();
            clearInterval(this._interval);
        }
    }

    private getTick() {
        return () => {
            this.onTick(Date.now());
        }
    }
}