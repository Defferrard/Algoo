import type {TileType, Entity, SimpleCoordinate} from "./";
import type {Resources} from "../game/";
import {EntityAlreadyExistsException, EntityNotExistsException, OutOfBoundsException, TileUnavailableException} from "../exceptions/";
import {Coordinate, Tile} from "./";
import {Node} from "../pathfinding";

/**
 * A board is a 2D array of tiles. It is used to represent the game map. It also contains interactions with the tiles.
 */
export default class Board {
    private readonly _tiles: Tile[][];
    private readonly _entities: { [key in string]: Coordinate } = {}

    /**
     * Create a new Board from a 2D array of TileTypes.
     * @param tiles 2D array of TileTypes.
     */
    constructor(tiles: TileType[][]) {
        // TODO : We can filter walls from _tiles array

        this._tiles = tiles.map((row: TileType[], y: number) =>
            row.map((type: TileType, x: number) => new Tile({x, y}, type)));
    }

    /**
     * Map the board into a 2D array of Nodes.
     */
    get mapNodes(): Node[][] {
        return this._tiles
            .map((row: Tile[], y: number) =>
                row.map((tile: Tile, x: number) =>
                    new Node({x, y}, tile.movementCost)
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
     * Get the tile at the given coordinate object.
     * @param coordinate 2D Coordinate object.
     */
    getTile(coordinate: SimpleCoordinate): Tile {
        if (!this.isValidCoordinate(coordinate)) throw new OutOfBoundsException(coordinate);
        return this._tiles[coordinate.y][coordinate.x];
    }

    /**
     * Add an entity to the board at the given XY coordinate.
     * @param entity
     * @param x X axis coordinate.
     * @param y Y axis coordinate.
     */
    pushEntity(entity: Entity<Resources>, coordinate: SimpleCoordinate): void {
        if (!this.isValidCoordinate(coordinate)) throw new OutOfBoundsException(coordinate);
        if (this._entities[entity.uuid]) throw new EntityAlreadyExistsException(entity, coordinate);
        if (this.getTile(coordinate).entity) throw new TileUnavailableException(coordinate);

        this._entities[entity.uuid] = new Coordinate(coordinate);
        this.getTile(coordinate).entity = entity;
    }

    moveEntity(entity: Entity<Resources>, coordinate: Coordinate): void {
        if (!this.isValidCoordinate(coordinate)) throw new OutOfBoundsException(coordinate);
        if (!this._entities[entity.uuid]) throw new EntityNotExistsException(entity);
        if (this.getTile(coordinate).movementCost < 0) throw new TileUnavailableException(coordinate);

        this.getTile(this.getEntityCoordinate(entity)).entity = undefined;
        this._entities[entity.uuid] = coordinate;
        this.getTile(coordinate).entity = entity;
    }

    deleteEntity(entity: Entity<Resources>): void {
        if (!this._entities[entity.uuid]) throw new EntityNotExistsException(entity);

        this.getTile(this._entities[entity.uuid]).entity = undefined;
        delete this._entities[entity.uuid];
    }

    getEntityCoordinate(entity: Entity<Resources>): Coordinate {
        if (!this._entities[entity.uuid]) throw new EntityNotExistsException(entity);
        return this._entities[entity.uuid];
    }

    /**
     * Get the sum movement cost of the given path.
     * @param path Path to get the cost of.
     */
    getPathCost(path: Coordinate[]): number {
        return path
            .map((coordinate: Coordinate) => this.getTile(coordinate)!.movementCost)
            .reduce((accumulator: number, cost: number) => accumulator + cost, 0)
    }

    isValidCoordinate(coordinate: Coordinate | {x:number, y:number}): boolean {
        return coordinate.x >= 0
            && coordinate.x < this.width
            && coordinate.y >= 0
            && coordinate.y < this.height;
    }

    get width(): number {
        return this._tiles[0].length;
    }

    get height(): number {
        return this._tiles.length;
    }
}