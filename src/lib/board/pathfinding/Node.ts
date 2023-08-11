import Coordinate from "../Coordinate";

export default class Node extends Coordinate {
    private _parent?: Node;
    private _g: number = Infinity;
    private readonly _cost: number = 0;

    constructor(x: number, y: number, cost: number) {
        super(x, y);
        this._cost = cost;
    }

    get parent(): Node | undefined {
        return this._parent;
    }

    set parent(parent: Node | undefined) {
        if (parent) {
            this._g = parent.g + this._cost;
        } else {
            this._g = Infinity;
        }
        this._parent = parent;
    }

    get g(): number {
        return this._g;
    }

    set g(value: number) {
        this._g = value;
    }

    get cost(): number {
        return this._cost;
    }
}