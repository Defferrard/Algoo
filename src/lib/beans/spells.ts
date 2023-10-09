import {Color} from "../components/Color";
import {DistanceStrategyType} from "../pattern/strategy/distance";
import {BandageIcon, DopingIcon, FlameIcon, HealIcon, SliceIcon, ToxicIcon} from "../assets/spells";
import type {Resources} from "../game";
import {ResourceType} from "$lib/game/";

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

    cost: Resources
}

export const spells: Record<string, SpellObject> = {
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
        }
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
        }
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
        }
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
        }
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
        }
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
        }
    }

}