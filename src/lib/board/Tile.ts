import Coordinate from "./Coordinate";
import type {Entity} from "../game";

export enum TileType {
    Wall = -1,
    Empty = 0,
    Floor = 1,
}

export default class Tile extends Coordinate {
    readonly type: TileType;
    entity?: Entity;

    constructor(x: number, y: number, type: TileType) {
        super(x, y);
        this.type = type;
    }

    get movementCost(): number {
        return this.entity ? -1 : this.type;
    }
}