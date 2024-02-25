import icon from "$lib/assets/spells/slice.svg";
import {DistanceStrategy, ActionStrategy} from "@defferrard/algoo-core/src/strategy/";
import {ResourceType, Color} from "@defferrard/algoo-core/src/game/";
import type {SpellDTO} from "@defferrard/algoo-core/src/game/";

const SPELL: SpellDTO = {
        name: "Slice",
        color: Color.GRAY,
        iconPath: icon,

        minimalRangeTarget: 1,
        maximalRangeTarget: 1,
        targetDistanceStrategy: DistanceStrategy.MOVEMENT,

        minimalRangeAttacked: 0,
        maximalRangeAttacked: 0,
        attackedDistanceStrategy: DistanceStrategy.MONO,
        cost: {
            [ResourceType.STAMINA]: 5
        },

        actions: [
            {
                type: ActionStrategy.UPDATE_RESSOURCE,
                args: {value: -2, type: ResourceType.HEALTH}
            }
        ]
    }

export default SPELL;