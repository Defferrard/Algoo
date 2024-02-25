import icon from "$lib/assets/spells/toxic.svg";
import {DistanceStrategy, ActionStrategy} from "@defferrard/algoo-core/src/strategy/";
import {ResourceType, Color} from "@defferrard/algoo-core/src/game/";
import type {SpellDTO} from "@defferrard/algoo-core/src/game/";

const SPELL: SpellDTO = {
        name: "Toxic",
        color: Color.PURPLE,
        iconPath: icon,

        minimalRangeTarget: 2,
        maximalRangeTarget: 5,
        targetDistanceStrategy: DistanceStrategy.SQUARE,

        minimalRangeAttacked: 0,
        maximalRangeAttacked: 1,
        attackedDistanceStrategy: DistanceStrategy.MOVEMENT,
        cost: {
            [ResourceType.STAMINA]: 7
        },

        actions: [
            {
                type: ActionStrategy.UPDATE_RESSOURCE,
                args: {value: -2, type: ResourceType.HEALTH}
            }
        ]
    }

export default SPELL;