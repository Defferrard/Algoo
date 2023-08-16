import {v4 as uuidV4} from 'uuid';
import type {Spell, Effect, Team} from "./";
import type {Tile, Board, Coordinate} from "../board/";

type Characteristics = {
    maxHealth: number,
    maxStamina: number,
    strength: number,
    resistance: number,
    durability: number
}

type Resources = {
    health: number,
    stamina: number
}

export default class Hero {
    readonly uuid: string = uuidV4();
    readonly name: string;
    readonly title: string;
    private readonly _spells: Spell[];
    private readonly _effects: Effect[] = [];

    tile: Tile;
    board: Board;
    readonly team: Team;

    private readonly _characteristics: Characteristics;
    private readonly _resources: Resources;


    constructor(team: Team, name: string, title: string, spells: Spell[], characteristics: Characteristics,
                coordinate: Coordinate, board: Board) {
        this.team = team;
        team.pushHero(this);
        this.name = name;
        this.title = title;
        this._spells = spells;
        this.board = board;
        this.tile = board.getTile(coordinate.x, coordinate.y);
        board.pushHero(this, coordinate.x, coordinate.y)
        this._characteristics = characteristics;
        this._resources = {health: characteristics.maxHealth, stamina: characteristics.maxStamina};
    }

    get maxHealth(): number {
        return this._characteristics.maxHealth;
    }

    get maxStamina(): number {
        return this._characteristics.maxStamina;
    }

    get stamina(): number {
        return this._resources.stamina;
    }

    set stamina(value: number) {
        this._resources.stamina = value;
    }

    get health(): number {
        return this._resources.health;
    }
}