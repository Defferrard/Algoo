import type {Effect, GameManager, Hero, Resources, Spell, StandardCharacteristics, Team} from "../";
import {ResourceType} from "../";
import {default as Entity} from "./Entity";
import type {Coordinate} from "../../board/";

export default class HeroEntity extends Entity {

    private readonly _effects: Effect[] = [];
    readonly team: Team;
    private readonly _hero: Hero;

    constructor(team: Team, hero:Hero, coordinate: Coordinate, gameManager: GameManager) {
        super(coordinate, gameManager, hero.characteristics.buildResources());
        this.team = team;
        this._hero = hero;
        team.pushHero(this);
        gameManager.setEntityAsHero(this.uuid);
    }


    onEndTurn() {
        this.resources[ResourceType.STAMINA]! += this._hero.characteristics.durability;
        this.resources[ResourceType.STAMINA] =
            Math.min(this.resources[ResourceType.STAMINA]!, this._hero.characteristics.max[ResourceType.STAMINA]!);
    }

    get name(): string {
        return this._hero.name;
    }

    get title(): string {
        return this._hero.title;
    }

    get spells(): Spell[] {
        return this._hero.spells;
    }

    get characteristics(): StandardCharacteristics {
        return this._hero.characteristics;
    }


}