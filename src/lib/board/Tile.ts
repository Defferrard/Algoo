import type Coordinate from "./Coordinate";

export enum TileType {
    Wall = -1,
    Empty = 0,
    Floor = 10,
}

export default class Tile {
    private readonly _coordinate: Coordinate;
    private readonly _type: TileType;
    private _hero: boolean = false;

    constructor(coordinate: Coordinate, type: TileType) {
        this._coordinate = coordinate;
        this._type = type;
    }

    get movementCost(): number {
        return this._type;
    }

}