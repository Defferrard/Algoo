import {ResourceType, Stance} from "@defferrard/algoo-core/src/game/";
import type {HeroDTO} from "@defferrard/algoo-core/src/game/";

const HERO: HeroDTO = {
    name: "Armony",
    title: "The musician",
    characteristics: {
        [ResourceType.HEALTH]: 10,
        [ResourceType.STAMINA]: 10,
        strength: 2,
        resistance: 2,
        durability: 2
    },
    spells: ["bandage", "heal", "slice"],
    stance: Stance.DANCE
}

export default HERO;