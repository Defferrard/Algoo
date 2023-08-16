import type {Readable, Writable} from "svelte/store";
import type {Coordinate, Tile} from "../../board";
import type {Hero} from "../../game";
import {writable} from "svelte/store";
import {Board, TileType} from "../../board";
import {delay} from "../../utils/Functions";

export function generateRandomBoard(width: number, height: number, wallProbability: number): UIBoard {
    let map: TileType[][] = [];
    for (let y = 0; y < height; y++) {
        map[y] = new Array(width);
        for (let x = 0; x < width; x++) {
            map[y][x] = Math.random() < wallProbability ? TileType.Wall : TileType.Floor;
        }
    }

    return new UIBoard(map);
}

// TODO : Rename to GameManager
export default class UIBoard extends Board {
    private readonly _map: Writable<(Hero | undefined)[][]>;
    private readonly _animatingStore: Writable<boolean> = writable(false);
    readonly targetHero: Writable<Hero | undefined> = writable(undefined);
    private readonly _currentHero: Writable<Hero | undefined> = writable(undefined);
    private _turnIndex: number = 0;
    private _animating: boolean = false;

    private _heroes: Hero[] = [];

    constructor(tiles: TileType[][]) {
        super(tiles);
        let map: (Hero | undefined)[][] = tiles.map((row: TileType[]) => row.map((_: TileType) => undefined));
        this._map = writable(map);
    }


    pushHero(hero: Hero, x: number, y: number) {
        let oldTile: Coordinate = hero.tile;
        super.pushHero(hero, x, y);
        this._map.update(map => {
            map[oldTile.y][oldTile.x] = undefined;
            map[hero.tile.y][hero.tile.x] = hero;
            return map;
        })
        if(this._heroes.length <= 0) this._currentHero.set(hero);
        if(!this._heroes.includes(hero)) this._heroes.push(hero);
    }

    async moveHero(hero: Hero, path: Coordinate[]): Promise<boolean> {
        if(this._animating || path.length <= 0) return false;
        this.animating = true;
        let oldTile: Coordinate = hero.tile;
        super.moveHero(hero, path)
        while(path.length > 0) {
            let tile: Coordinate = path.pop()!;
            this._map.update(map => {
                map[oldTile.y][oldTile.x] = undefined;
                map[tile.y][tile.x] = hero;
                return map;
            })
            oldTile = tile;
            await delay(100);
        }
        this.animating = false;
        return true;
    }

    nextTurn(): void {
        this._turnIndex++;
        this._currentHero.set(this.getCurrentHero());
    }

    get map(): Readable<(Hero | undefined)[][]> {
        return {subscribe: this._map.subscribe};
    }

    get animating(): Readable<boolean> {
        return {subscribe: this._animatingStore.subscribe};
    }

    get currentHero(): Readable<Hero | undefined> {
        return {subscribe: this._currentHero.subscribe};
    }

    private getCurrentHero(): Hero {
        return this._heroes[this._turnIndex % this._heroes.length];
    }

    private set animating(value: boolean) {
        this._animating = value;
        this._animatingStore.set(value);
    }
}