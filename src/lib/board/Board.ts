import type {Hero} from "../game/";
import {Tile, TileType, Coordinate} from "./";
import Node from "./pathfinding/Node";

export default class Board {
    private readonly _tiles: Tile[][];

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


    getTile(x: number, y: number): Tile {
        return this._tiles[y][x];
    }

    getTileByCoordinate(coordinate: Coordinate): Tile {
        return this.getTile(coordinate.x, coordinate.y);
    }

    pushHero(hero: Hero, x: number, y: number): void {
        hero.tile.hero = undefined;
        hero.tile = this.getTile(x, y);
        hero.tile.hero = hero;
    }

    moveHero(hero: Hero, path: Coordinate[]): void {
        hero.stamina -= this.getPathCost(path);
        hero.tile.hero = undefined;
        hero.tile = this.getTileByCoordinate(path[0]);
        hero.tile.hero = hero;
    }

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