import {v4 as uuidV4} from "uuid";
import Coordinate from "./Coordinate";
import type {Entity} from "../game";
import type {Resources} from "../game";

export enum TileType {
    Wall = -1,
    Empty = 0,
    Floor = 1,
}

export default class Tile extends Coordinate {
    readonly type: TileType;
    entity?: Entity<Resources>;

    readonly uuid: string = uuidV4();

    constructor(x: number, y: number, type: TileType) {
        super(x, y);
        this.type = type;
    }

    get movementCost(): number {
        return this.entity ? -1 : this.type;
    }

    get stringId(): string {
        return "Tile{" + this.uuid + "}";
    }
}