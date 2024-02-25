import {Color} from "../Color";
import {ActionStrategy, DistanceStrategy} from "../../strategy";
import {Resources} from "../characteristics/Characteristics";

export type SpellDTO = {
    name: string,
    color: Color,
    iconPath: string,

    minimalRangeTarget: number,
    maximalRangeTarget: number,
    targetDistanceStrategy?: DistanceStrategy,

    minimalRangeAttacked: number,
    maximalRangeAttacked: number,
    attackedDistanceStrategy?: DistanceStrategy,

    cost: Resources,

    actions: { "type": ActionStrategy, "args": { [key in string]: any } }[]
}