import {inRange} from "lodash";
import type {Resources, Color, SpellDTO} from "../";
import type {Board, Coordinate} from "../../board";
import type {Node} from "../../pathfinding";
import type {DistanceStrategyCallable} from "../../strategy";
import {DISTANCE_STRATEGIES, ACTION_STRATEGIES, ActionStrategy} from "../../strategy";
import type {ActionStrategyCallable, ActionResume} from "../../strategy";
import {Entity, Tile} from "../../board";

type SpellAction = {
    strategy?: ActionStrategyCallable,
    type: ActionStrategy,
    args: { [key in string]: any }
};

export default class Spell {
    readonly color: Color;
    readonly iconPath: string;

    readonly name: string;

    readonly minimalRangeTarget: number;
    readonly maximalRangeTarget: number;
    readonly targetDistanceStrategy: DistanceStrategyCallable;

    readonly minimalRangeAttacked: number;
    readonly maximalRangeAttacked: number;
    readonly attackedDistanceStrategy: DistanceStrategyCallable;

    readonly cost: Resources;

    private readonly _actions: SpellAction[];


    constructor(dto: SpellDTO) {
        this.color = dto.color;
        this.iconPath = dto.iconPath;
        this.name = dto.name;

        this.minimalRangeTarget = dto.minimalRangeTarget;
        this.maximalRangeTarget = dto.maximalRangeTarget;
        this.targetDistanceStrategy = DISTANCE_STRATEGIES[dto.targetDistanceStrategy!];

        this.minimalRangeAttacked = dto.minimalRangeAttacked;
        this.maximalRangeAttacked = dto.maximalRangeAttacked;
        this.attackedDistanceStrategy = DISTANCE_STRATEGIES[dto.attackedDistanceStrategy!];

        this.cost = dto.cost;

        this._actions = dto.actions.map((action) => {
            return {
                strategy: ACTION_STRATEGIES[action.type],
                type: action.type,
                args: action.args
            }
        });
    }

    cast(by: Entity<Resources>, from: Coordinate, to: Coordinate, on: Board): ActionResume[] {
        const RESUME: ActionResume[] = [];

        if (!by.pay(this.cost)) return RESUME;

        for (let action of this._actions) {
            RESUME.push(
                action.strategy!(this, by,
                    this.attackedTiles(from, to, on).map((c: Coordinate) => on.getTile(c)),
                    action.args)
            );
        }

        return RESUME;
    }

    targetableTiles(from: Coordinate, board: Board, filter: Coordinate[]): Coordinate[] {
        const map: Node[][] = board.mapNodes;
        let targetable: Coordinate[] = [...map.flat()]
            .filter((n: Node) => inRange(this.targetDistanceStrategy(from, n),
                this.minimalRangeTarget, this.maximalRangeTarget + 1))

        return targetable
    }

    attackedTiles(from: Coordinate, to: Coordinate, board: Board): Coordinate[] {
        const map: Node[][] = board.mapNodes;
        let attacked: Coordinate[] = [...map.flat()]
            .filter((n: Node) => inRange(this.attackedDistanceStrategy(to, n),
                this.minimalRangeAttacked, this.maximalRangeAttacked + 1));

        return attacked
    }
}