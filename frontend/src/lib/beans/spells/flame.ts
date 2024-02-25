import icon from "$lib/assets/spells/flame.svg";
import {DistanceStrategy, ActionStrategy} from "@defferrard/algoo-core/src/strategy/";
import {ResourceType, Color} from "@defferrard/algoo-core/src/game/";
import type {SpellDTO} from "@defferrard/algoo-core/src/game/";

const SPELL: SpellDTO = {
    name: "Flame",
    color: Color.RED,
    iconPath: icon,

    minimalRangeTarget: 2,
    maximalRangeTarget: 4,
    targetDistanceStrategy: DistanceStrategy.MOVEMENT,

    minimalRangeAttacked: 0,
    maximalRangeAttacked: 0,
    attackedDistanceStrategy: DistanceStrategy.MONO,
    cost: {
        [ResourceType.STAMINA]: 10
    },

    actions: [
        {
            type: ActionStrategy.UPDATE_RESSOURCE,
            args: {value: -2, type: ResourceType.HEALTH}
        }
    ]
}

export default SPELL;