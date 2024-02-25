export type SimpleCoordinate = Coordinate | { x: number, y: number };
export default class Coordinate {
    readonly x: number;
    readonly y: number;

    constructor(coordinate: SimpleCoordinate) {
        this.x = coordinate.x;
        this.y = coordinate.y;
    }

    toString(): string {
        return `(${this.x};${this.y})`;
    }

    is(coordinate: SimpleCoordinate): boolean {
        return this.x === coordinate.x && this.y === coordinate.y;
    }

    equals(coordinate: Coordinate): boolean {
        return this.x === coordinate.x && this.y === coordinate.y;
    }

    plus(coordinate: Coordinate): Coordinate {
        const x: number = this.x + coordinate.x;
        const y: number = this.y + coordinate.y;
        return new Coordinate({x, y});
    }

    minus(coordinate: Coordinate): Coordinate {
        const x: number = this.x - coordinate.x;
        const y: number = this.y - coordinate.y;
        return new Coordinate({x, y});
    }

    plusDirection(direction: Coordinate, distance: number): Coordinate {
        const x: number = this.x + direction.x * distance;
        const y: number = this.y + direction.y * distance;
        return new Coordinate({x, y});
    }

    normalized(): Coordinate {
        if (this.getLength() === 0) {
            return new Coordinate({x: 0, y: 0});
        }
        const x: number = this.x / this.getLength();
        const y: number = this.y / this.getLength();
        return new Coordinate({x, y});
    }

    floored(): Coordinate {
        const x: number = Math.floor(this.x);
        const y: number = Math.floor(this.y);
        return new Coordinate({x, y});
    }


    getLength(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    get neighbors(): Coordinate[] {
        return [
            new Coordinate({x: this.x - 1, y: this.y}),
            new Coordinate({x: this.x + 1, y: this.y}),
            new Coordinate({x: this.x, y: this.y - 1}),
            new Coordinate({x: this.x, y: this.y + 1}),
        ];
    }

    isNeighbor(coordinate: Coordinate): boolean {
        return Math.abs(this.x - coordinate.x) + Math.abs(this.y - coordinate.y) === 1;
    }
}