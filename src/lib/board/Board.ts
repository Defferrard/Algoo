import Coordinate from "./Coordinate";
import Tile, {TileType} from "./Tile";
import Node from "./pathfinding/Node";

export default class Board {
    private readonly _tiles: Tile[][];

    constructor(tiles: TileType[][]) {
        this._tiles = tiles.map((row: TileType[], y: number) =>
            row.map((type: TileType, x: number) => new Tile(new Coordinate(x, y), type)));
    }


    /**
     * Map the board into a 2D array of Nodes.
     */
    get mapNodes(): Node[][] {
        return this._tiles
            .map((row: Tile[], y: number) =>
                row.map((tile: Tile, x: number) =>
                    new Node(x, y, tile.movementCost)
                )
            );
    }

    /**
     * Get the minimal movement cost of all tiles on the board, ignoring negative values.
     */
    get minimalMovementCost(): number {
        return this._tiles
            .reduce((min: number, row: Tile[]) =>
                    Math.min(min, ...row.map(tile => tile.movementCost).filter(cost => cost > 0)),
                Infinity);
    }


    getTile(x: number, y: number): Tile {
        return this._tiles[y][x];
    }

    get width(): number {
        return this._tiles[0].length;
    }

    get height(): number {
        return this._tiles.length;
    }
}