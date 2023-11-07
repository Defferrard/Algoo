import type {Entity, Resources} from "../game/";
import {Tile, TileType, Coordinate} from "./";
import Node from "./pathfinding/Node";

/**
 * A board is a 2D array of tiles. It is used to represent the game map. It also contains interactions with the tiles.
 */
export default class Board {
    private readonly _tiles: Tile[][];

    /**
     * Create a new Board from a 2D array of TileTypes.
     * @param tiles 2D array of TileTypes.
     */
    constructor(tiles: TileType[][]) {
        this._tiles = tiles.map((row: TileType[], y: number) =>
            row.map((type: TileType, x: number) => new Tile(x, y, type)));
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

    /**
     * Get the tile at the given XY coordinate.
     * @param x X axis coordinate.
     * @param y Y axis coordinate.
     */
    getTile(x: number, y: number): Tile {
        return this._tiles[y][x];
    }

    /**
     * Get the tile at the given coordinate object.
     * @param coordinate 2D Coordinate object.
     */
    getTileByCoordinate(coordinate: Coordinate): Tile {
        return this.getTile(coordinate.x, coordinate.y);
    }

    /**
     * Add an entity to the board at the given XY coordinate.
     * @param hero Hero to add to the board.
     * @param x X axis coordinate.
     * @param y Y axis coordinate.
     */
    pushEntity(entity: Entity<Resources>, x: number, y: number): void {
        entity.tile!.entity = undefined;
        entity.tile = this.getTile(x, y);
        entity.tile.entity = entity;
    }

    /**
     * Get the sum movement cost of the given path.
     * @param path Path to get the cost of.
     */
    getPathCost(path: Coordinate[]): number {
        return path
            .map((coordinate: Coordinate) => this.getTileByCoordinate(coordinate)!.movementCost)
            .reduce((accumulator: number, cost: number) => accumulator + cost, 0)
    }

    get width(): number {
        return this._tiles[0].length;
    }

    get height(): number {
        return this._tiles.length;
    }
}