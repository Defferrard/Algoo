import Coordinate from "./Coordinate";
import type Hero from "../game/Hero";

export enum TileType {
    Wall = -1,
    Empty = 0,
    Floor = 1,
}

export default class Tile extends Coordinate {
    readonly type: TileType;
    hero?: Hero;

    constructor(x: number, y: number, type: TileType) {
        super(x, y);
        this.type = type;
    }

    get movementCost(): number {
        return this.hero ? -1 : this.type;
    }
}