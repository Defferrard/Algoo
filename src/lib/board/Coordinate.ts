export default class Coordinate {
    private readonly _x: number;
    private readonly _y: number;

    constructor(x: number, y: number) {
        this._x = x;
        this._y = y;
    }

    toString(): string {
        return `(${this._x}, ${this._y})`;
    }

    is(x: number, y: number) : boolean {
        return this._x === x && this._y === y;
    }

    equals(coordinate: Coordinate) : boolean {
        return this._x === coordinate.x && this._y === coordinate.y;
    }

    plus(coordinate: Coordinate) : Coordinate {
        return new Coordinate(this._x + coordinate.x, this._y + coordinate.y);
    }

    minus(coordinate: Coordinate) : Coordinate {
        return new Coordinate(this._x - coordinate.x, this._y - coordinate.y);
    }

    plusDirection(direction:Coordinate, distance:number) : Coordinate {
        return new Coordinate(this._x + direction.x * distance, this._y + direction.y * distance);
    }

    normalized() : Coordinate {
        if(this.getLength() === 0) {
            return new Coordinate(0, 0);
        }
        return new Coordinate(this._x / this.getLength(), this._y / this.getLength());
    }

    floored() : Coordinate {
        return new Coordinate(Math.floor(this._x), Math.floor(this._y));
    }

    getLength() : number {
        return Math.sqrt(this._x * this._x + this._y * this._y);
    }

    get x(): number {
        return this._x;
    }

    get y(): number {
        return this._y;
    }


}