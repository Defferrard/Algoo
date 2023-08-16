export default class Coordinate {
    readonly x: number;
    readonly y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    toString(): string {
        return `(${this.x}, ${this.y})`;
    }

    is(x: number, y: number): boolean {
        return this.x === x && this.y === y;
    }

    equals(coordinate: Coordinate): boolean {
        return this.x === coordinate.x && this.y === coordinate.y;
    }

    plus(coordinate: Coordinate): Coordinate {
        return new Coordinate(this.x + coordinate.x, this.y + coordinate.y);
    }

    minus(coordinate: Coordinate): Coordinate {
        return new Coordinate(this.x - coordinate.x, this.y - coordinate.y);
    }

    plusDirection(direction: Coordinate, distance: number): Coordinate {
        return new Coordinate(this.x + direction.x * distance, this.y + direction.y * distance);
    }

    normalized(): Coordinate {
        if (this.getLength() === 0) {
            return new Coordinate(0, 0);
        }
        return new Coordinate(this.x / this.getLength(), this.y / this.getLength());
    }

    floored(): Coordinate {
        return new Coordinate(Math.floor(this.x), Math.floor(this.y));
    }

    getLength(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    get neighbors(): Coordinate[] {
        return [
            new Coordinate(this.x - 1, this.y),
            new Coordinate(this.x + 1, this.y),
            new Coordinate(this.x, this.y - 1),
            new Coordinate(this.x, this.y + 1),
        ];
    }
}