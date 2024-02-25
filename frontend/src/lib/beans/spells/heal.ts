import icon from "$lib/assets/spells/heal.svg";
import {DistanceStrategy, ActionStrategy} from "@defferrard/algoo-core/src/strategy/";
import {ResourceType, Color} from "@defferrard/algoo-core/src/game/";
import type {SpellDTO} from "@defferrard/algoo-core/src/game/";

const SPELL: SpellDTO = {
        name: "Heal",
        color: Color.PINK,
        iconPath: icon,

        minimalRangeTarget: 1,
        maximalRangeTarget: 5,
        targetDistanceStrategy: DistanceStrategy.MOVEMENT,

        minimalRangeAttacked: 0,
        maximalRangeAttacked: 0,
        attackedDistanceStrategy: DistanceStrategy.MONO,
        cost: {
            [ResourceType.STAMINA]: 7
        },

        actions: [
            {
                type: ActionStrategy.UPDATE_RESSOURCE,
                args: {value: 5, type: ResourceType.HEALTH}
            }
        ]
    }

export default SPELL;