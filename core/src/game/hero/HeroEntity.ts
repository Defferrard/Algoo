import type {CompleteHeroDTO, Effect} from "../";
import {ResourceType, Stance, StandardCharacteristics, Spell} from "../";
import type {StandardResources} from "../";
import {Entity} from "../../board";


export default class HeroEntity extends Entity<StandardResources> {

    readonly name: string;
    readonly title: string;
    readonly characteristics: StandardCharacteristics;
    readonly spells: Spell[];
    readonly effects: Effect[];
    stance: Stance;

    constructor(dto: CompleteHeroDTO) {
        // TODO : Can we simplify ? (Can we generate maxResources dynamically from dto.characteristics ?)
        const CHARACTERISTICS: StandardCharacteristics = new StandardCharacteristics(
            {
                [ResourceType.HEALTH]: dto.characteristics[ResourceType.HEALTH],
                [ResourceType.STAMINA]: dto.characteristics[ResourceType.STAMINA]
            },
            dto.characteristics.strength,
            dto.characteristics.resistance,
            dto.characteristics.durability
        );

        super(dto.characteristics);

        this.name = dto.name;
        this.title = dto.title;
        this.characteristics = CHARACTERISTICS;
        this.spells = dto.spells.map((spell) => new Spell(spell));
        this.effects = [];
        this.stance = dto.stance;
    }

    onEndTurn() {
        this.resources[ResourceType.STAMINA]! += this.characteristics.durability;
        this.resources[ResourceType.STAMINA] =
            Math.min(this.resources[ResourceType.STAMINA]!, this.characteristics.max[ResourceType.STAMINA]!);
    }

    updateResource(type: ResourceType, updateFunction: (value: number) => number): number {
        const OLD_VALUE = this.resources[type]!;
        super.updateResource(type, updateFunction);
        if (this.resources[type]! > this.characteristics.max[type]!) {
            this.resources[type] = this.characteristics.max[type]!;
        }
        return this.resources[type]! - OLD_VALUE;
    }
}