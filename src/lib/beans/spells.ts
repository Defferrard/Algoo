import {Color} from "../components/Color";
import {DistanceStrategyType} from "../pattern/strategy/distance";
import {BandageIcon, DopingIcon, FlameIcon, HealIcon, SliceIcon, ToxicIcon} from "../assets/spells";
import type {Resources} from "../game";
import {ResourceType} from "$lib/game/";
import {SpellActionType} from "$lib/pattern/strategy/spellAction";

export type SpellObject = {
    name: string,
    color: Color,
    iconPath: string,

    minimalRangeTarget: number,
    maximalRangeTarget: number,
    targetDistanceStrategy?: DistanceStrategyType,

    minimalRangeAttacked: number,
    maximalRangeAttacked: number,
    attackedDistanceStrategy?: DistanceStrategyType,

    cost: Resources,

    actions: { "type": SpellActionType, "args": { [key in string]: any } }[]
}

export const spells: { [key in string]: SpellObject } = {
    "bandage": {
        name: "Bandage",
        color: Color.PINK,
        iconPath: BandageIcon,

        minimalRangeTarget: 0,
        maximalRangeTarget: 1,
        targetDistanceStrategy: DistanceStrategyType.MOVEMENT,


        minimalRangeAttacked: 0,
        maximalRangeAttacked: 0,
        attackedDistanceStrategy: DistanceStrategyType.MONO,

        cost: {
            [ResourceType.STAMINA]: 2
        },

        actions: [
            {
                type: SpellActionType.UPDATE_RESSOURCE,
                args: {value: 5, type: ResourceType.HEALTH}
            }
        ]
    },
    "doping": {
        name: "Doping",
        color: Color.YELLOW,
        iconPath: DopingIcon,

        minimalRangeTarget: 0,
        maximalRangeTarget: 1,
        targetDistanceStrategy: DistanceStrategyType.MOVEMENT,

        minimalRangeAttacked: 0,
        maximalRangeAttacked: 0,
        attackedDistanceStrategy: DistanceStrategyType.MONO,
        cost: {
            [ResourceType.HEALTH]: 2
        },

        actions: [
            {
                type: SpellActionType.UPDATE_RESSOURCE,
                args: {value: 2, type: ResourceType.STAMINA}
            }
        ]
    },
    "flame": {
        name: "Flame",
        color: Color.RED,
        iconPath: FlameIcon,

        minimalRangeTarget: 2,
        maximalRangeTarget: 4,
        targetDistanceStrategy: DistanceStrategyType.MOVEMENT,

        minimalRangeAttacked: 0,
        maximalRangeAttacked: 0,
        attackedDistanceStrategy: DistanceStrategyType.MONO,
        cost: {
            [ResourceType.STAMINA]: 10
        },

        actions: [
            {
                type: SpellActionType.UPDATE_RESSOURCE,
                args: {value: -2, type: ResourceType.HEALTH}
            }
        ]
    },
    "heal": {
        name: "Heal",
        color: Color.PINK,
        iconPath: HealIcon,

        minimalRangeTarget: 1,
        maximalRangeTarget: 5,
        targetDistanceStrategy: DistanceStrategyType.MOVEMENT,

        minimalRangeAttacked: 0,
        maximalRangeAttacked: 0,
        attackedDistanceStrategy: DistanceStrategyType.MONO,
        cost: {
            [ResourceType.STAMINA]: 7
        },

        actions: [
            {
                type: SpellActionType.UPDATE_RESSOURCE,
                args: {value: 5, type: ResourceType.HEALTH}
            }
        ]
    },
    "slice": {
        name: "Slice",
        color: Color.GRAY,
        iconPath: SliceIcon,

        minimalRangeTarget: 1,
        maximalRangeTarget: 1,
        targetDistanceStrategy: DistanceStrategyType.MOVEMENT,

        minimalRangeAttacked: 0,
        maximalRangeAttacked: 0,
        attackedDistanceStrategy: DistanceStrategyType.MONO,
        cost: {
            [ResourceType.STAMINA]: 5
        },

        actions: [
            {
                type: SpellActionType.UPDATE_RESSOURCE,
                args: {value: -2, type: ResourceType.HEALTH}
            }
        ]
    },
    "toxic": {
        name: "Toxic",
        color: Color.PURPLE,
        iconPath: ToxicIcon,

        minimalRangeTarget: 2,
        maximalRangeTarget: 5,
        targetDistanceStrategy: DistanceStrategyType.SQUARE,

        minimalRangeAttacked: 0,
        maximalRangeAttacked: 1,
        attackedDistanceStrategy: DistanceStrategyType.MOVEMENT,
        cost: {
            [ResourceType.STAMINA]: 7
        },

        actions: [
            {
                type: SpellActionType.UPDATE_RESSOURCE,
                args: {value: -2, type: ResourceType.HEALTH}
            }
        ]
    }

}