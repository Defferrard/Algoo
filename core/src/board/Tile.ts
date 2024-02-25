import {Coordinate, SimpleCoordinate} from "./";
import type {TileType, Entity} from "./";
import type {Resources} from "../game/";

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