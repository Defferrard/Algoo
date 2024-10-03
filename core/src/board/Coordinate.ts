import { CoordinateDTO, DTOFriendly } from '../dto';

export type BaseCoordinate = { x: number; y: number };
export type SimpleCoordinate = BaseCoordinate;
export default class Coordinate implements BaseCoordinate, DTOFriendly<CoordinateDTO> {
  readonly x: number;
  readonly y: number;

  constructor(coordinate: SimpleCoordinate) {
    this.x = coordinate.x;
    this.y = coordinate.y;
  }

  toString(): string {
    return `(${this.x};${this.y})`;
  }

  /** @deprecated use equals instead */
  is(coordinate: SimpleCoordinate): boolean {
    return this.x === coordinate.x && this.y === coordinate.y;
  }

  equals(coordinate: SimpleCoordinate): boolean {
    return Coordinate.equals(this, coordinate);
  }

  static equals(a: SimpleCoordinate | undefined, b: SimpleCoordinate | undefined): boolean {
    return !!a && !!b && a.x === b.x && a.y === b.y;
  }

  plus(coordinate: SimpleCoordinate): Coordinate {
    return new Coordinate(Coordinate.plus(this, coordinate));
  }

  static plus(a: SimpleCoordinate, b: SimpleCoordinate): SimpleCoordinate {
    return {
      x: a.x + b.x,
      y: a.y + b.y,
    };
  }

  minus(coordinate: SimpleCoordinate): Coordinate {
    const x: number = this.x - coordinate.x;
    const y: number = this.y - coordinate.y;
    return new Coordinate({ x, y });
  }

  plusDirection(direction: Coordinate, distance: number): Coordinate {
    return new Coordinate(Coordinate.plusDirection(this, direction, distance));
  }

  static plusDirection(coordinate: SimpleCoordinate, direction: Coordinate, distance: number): SimpleCoordinate {
    return {
      x: coordinate.x + direction.x * distance,
      y: coordinate.y + direction.y * distance,
    };
  }

  normalized() {
    if (this.getLength() === 0) {
      return new Coordinate({ x: 0, y: 0 });
    }
    const x: number = this.x / this.getLength();
    const y: number = this.y / this.getLength();
    return new Coordinate({ x, y });
  }

  floored() {
    return new Coordinate(Coordinate.floored(this));
  }
  static floored(coordinate: SimpleCoordinate): SimpleCoordinate {
    return {
      x: Math.floor(coordinate.x),
      y: Math.floor(coordinate.y),
    };
  }

  getLength(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  get neighbors(): Coordinate[] {
    return Coordinate.getNeighbors(this).map((simpleNeighbor) => new Coordinate(simpleNeighbor));
  }

  static getNeighbors(coordinate: SimpleCoordinate): SimpleCoordinate[] {
    return [
      { x: coordinate.x - 1, y: coordinate.y },
      { x: coordinate.x + 1, y: coordinate.y },
      { x: coordinate.x, y: coordinate.y - 1 },
      { x: coordinate.x, y: coordinate.y + 1 },
    ];
  }

  isNeighbor(coordinate: SimpleCoordinate): boolean {
    return Coordinate.isNeighbor(this, coordinate);
  }

  static isNeighbor(a: SimpleCoordinate, b: SimpleCoordinate): boolean {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y) === 1;
  }

  toDTO() {
    return Coordinate.toDTO(this);
  }
  static toDTO(coordinate: SimpleCoordinate) {
    const dto = new CoordinateDTO();
    dto.x = coordinate.x;
    dto.y = coordinate.y;
    return dto;
  }
}
