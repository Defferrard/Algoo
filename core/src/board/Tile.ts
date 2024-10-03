import type { Resources } from '../game/';
import { Coordinate, SimpleCoordinate } from './';
import type { Entity, TileType } from './';

export default class Tile extends Coordinate {
  readonly type: TileType;
  entity?: Entity<Resources>;

  constructor(coordinate: SimpleCoordinate, type: TileType) {
    super(coordinate);
    this.type = type;
  }

  get movementCost(): number {
    return this.entity ? -1 : this.type;
  }
}
