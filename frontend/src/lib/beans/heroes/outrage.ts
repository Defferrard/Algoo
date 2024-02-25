import {ResourceType, Stance} from "@defferrard/algoo-core/src/game/";
import type {HeroDTO} from "@defferrard/algoo-core/src/game/";

const HERO: HeroDTO = {
    name: "Outrage",
    title: "Is ready to fight",
    characteristics: {
        [ResourceType.HEALTH]: 5,
        [ResourceType.STAMINA]: 20,
        strength: 2,
        resistance: 2,
        durability: 2
    },
    spells: ["flame", "slice", "toxic"],
    stance: Stance.VIBRATE
}

export default HERO;