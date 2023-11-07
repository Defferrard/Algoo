import type {Effect, GameManager, Hero, Spell, StandardCharacteristics, StandardResources, Team} from "../";
import {ResourceType} from "../";
import {default as Entity} from "./Entity";
import type {Coordinate} from "../../board/";
import type {Writable} from "svelte/store";


export default class HeroEntity extends Entity<StandardResources> {

    private readonly _effects: Effect[] = [];
    readonly team: Team;
    private readonly _hero: Hero;

    constructor(team: Team, hero: Hero, coordinate: Coordinate, gameManager: GameManager) {
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


    update(updateFunction: (entity: HeroEntity) => HeroEntity): void {
        this.gameManager.findEntityByUuid(this.uuid)!.set(updateFunction(this));
    }

    getWritable(): Writable<HeroEntity> {
        return this.gameManager.findEntityByUuid(this.uuid) as Writable<HeroEntity>;
    }

    updateResource(type: ResourceType, updateFunction: (value: number) => number) {
        super.updateResource(type, updateFunction);
        if (this.resources[type]! > this.characteristics.max[type]!) {
            this.resources[type] = this.characteristics.max[type]!;
        }else if (type === ResourceType.HEALTH && this.resources[type]! <= 0) {
            this.gameManager.killEntity(this.uuid);
        }
    }
}