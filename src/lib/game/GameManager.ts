import type {Readable, Writable} from "svelte/store";
import type {Coordinate} from "../board";
import type {HeroEntity, Entity, StandardCharacteristics, Resources} from "./";
import {get, writable} from "svelte/store";
import {Board, TileType} from "../board";
import {delay} from "../utils/Functions";
import type {ArrayObserver, Observer} from "../utils/Observer";
import {arrayObserver, observer} from "../utils/Observer";
import {mapRArray} from "../utils/RArray";
import {ResourceType} from "./";

export function generateRandomBoard(width: number, height: number, wallProbability: number): GameManager {
    let map: TileType[][] = [];
    for (let y = 0; y < height; y++) {
        map[y] = new Array(width);
        for (let x = 0; x < width; x++) {
            map[y][x] = Math.random() < wallProbability ? TileType.Wall : TileType.Floor;
        }
    }

    return new GameManager(map);
}

export default class GameManager {
    // Whether the client is currently animating.
    // TODO : Use a buffer !
    private _animating: boolean = false;
    private readonly _entityMap: Observer<Entity<Resources> | undefined>[][];
    private readonly _entityMapRArrayObserver: ArrayObserver<(Entity<Resources> | undefined)[][]>;
    private readonly _animatingStore: Writable<boolean> = writable(false);
    readonly board: Board;
    private readonly _currentHero: Observer<HeroEntity | undefined> = observer();
    private _turnIndex: number = 0;

    private _heroes: Writable<HeroEntity>[] = [];
    private _entities: { [key in string]: Writable<Entity<Resources>> } = {};

    constructor(tiles: TileType[][]) {
        this.board = new Board(tiles);

        this._entityMap = mapRArray(tiles, (tile: TileType, index: number[]) => observer(writable())) as any;
        this._entityMapRArrayObserver = arrayObserver(this._entityMap as any) as any;
    }

    pushEntity(entity: Entity<Resources>, x: number, y: number) {
        let oldTile: Coordinate | undefined = entity.tile;
        this.board.pushEntity(entity, x, y);

        let writableEntity: Writable<Entity<Resources>> = this._entities[entity.uuid] || writable(entity);
        if (!this._entities[entity.uuid]) {
            this._entities[entity.uuid] = writableEntity;
        }

        if (oldTile) {
            this._entityMap[oldTile.y][oldTile.x].set(writable());
        }

        this._entityMap[entity.tile!.y][entity.tile!.x].set(writableEntity);

    }

    setEntityAsHero(uuid: string) {
        let writableHero: Writable<HeroEntity> = this._entities[uuid] as Writable<HeroEntity>;
        this._heroes.push(writableHero);

        if (!get(this._currentHero)) {
            this._currentHero.set(writableHero);
        }
    }

    async moveEntityByUUID(uuid: string, path: Coordinate[]): Promise<boolean> {
        if (this._animating || path.length <= 0) return false;
        this.animating = true;
        const writableEntity: Writable<Entity<Resources>> = this.findEntityByUuid(uuid)!;

        const entity = get(writableEntity);
        let oldTile: Coordinate = entity.tile!;

        writableEntity.update(entity => {
            entity.resources[ResourceType.STAMINA]! -= this.board.getPathCost(path);
            entity.tile!.entity = undefined;
            entity.tile = this.board.getTileByCoordinate(path[0]);
            entity.tile.entity = entity;
            return entity;
        });

        while (path.length > 0) {
            let tile: Coordinate = path.pop()!;
            this._entityMap[oldTile.y][oldTile.x].set(writable());
            this._entityMap[tile.y][tile.x].set(writableEntity);
            oldTile = tile;
            await delay(75);
        }

        this.animating = false;
        return true;
    }

    nextTurn(): void {
        // End Turn
        for (let hero of this._heroes) {
            get(hero).onEndTurn();
        }
        this._turnIndex++;
        this._currentHero.set(this.getCurrentHero());
    }

    findEntityByUuid(uuid: string): Writable<Entity<Resources>> | undefined {
        return this._entities[uuid];
    }

    /**
     * Returns a read-only version of the entity map store.
     */
    get entityMap(): Readable<(Entity<Resources> | undefined)[][]> {
        return {subscribe: this._entityMapRArrayObserver.subscribe};
    }

    get animating(): Readable<boolean> {
        return {subscribe: this._animatingStore.subscribe};
    }

    /**
     * Returns a read-only version of the current hero store.
     */
    get currentHero(): Readable<HeroEntity | undefined> {
        return {subscribe: this._currentHero.subscribe};
    }

    private getCurrentHero(): Writable<HeroEntity> {
        return this._heroes[this._turnIndex % this._heroes.length];
    }

    private set animating(value: boolean) {
        this._animating = value;
        this._animatingStore.set(value);
    }

    killEntity(uuid: string) {
        console.error("Not implemented yet !")
    }
}