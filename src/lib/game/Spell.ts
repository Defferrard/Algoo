import type {Color} from "../components/Color";
import type {Board, Coordinate} from "../board/";
import type Node from "../board/pathfinding/Node";
import {inRange} from "../utils/Functions";
import type {DistanceStrategy} from "../pattern/strategy/distance";
import {distanceStrategies} from "../pattern/strategy/distance";
import type {HeroEntity, Resources} from "../game";
import type {SpellObject} from "../beans/spells";
import type {SpellActionStrategy} from "../pattern/strategy/spellAction";
import {getSpellAction, SpellActionType} from "../pattern/strategy/spellAction";
import {ResourceType} from "../game";

type SpellAction = {
    strategy?: SpellActionStrategy,
    type: SpellActionType,
    args: { [key in string]: any }
};

export default class Spell {
    readonly color: Color;
    readonly iconPath: string;

    readonly name: string;

    readonly minimalRangeTarget: number;
    readonly maximalRangeTarget: number;
    readonly targetDistanceStrategy: DistanceStrategy;

    readonly minimalRangeAttacked: number;
    readonly maximalRangeAttacked: number;
    readonly attackedDistanceStrategy: DistanceStrategy;

    readonly cost: Resources;

    private readonly _actions: SpellAction[];


    constructor(spellObject: SpellObject) {
        this.color = spellObject.color;
        this.iconPath = spellObject.iconPath;
        this.name = spellObject.name;

        this.minimalRangeTarget = spellObject.minimalRangeTarget;
        this.maximalRangeTarget = spellObject.maximalRangeTarget;
        this.targetDistanceStrategy = distanceStrategies[spellObject.targetDistanceStrategy!];

        this.minimalRangeAttacked = spellObject.minimalRangeAttacked;
        this.maximalRangeAttacked = spellObject.maximalRangeAttacked;
        this.attackedDistanceStrategy = distanceStrategies[spellObject.attackedDistanceStrategy!];

        this.cost = spellObject.cost;

        this._actions = spellObject.actions.map((action) => {
            return {
                strategy: getSpellAction(action.type),
                type: action.type,
                args: action.args
            }
        });
    }

    cast(by: HeroEntity, to: Coordinate): boolean {
        let result: boolean = true;
        by.update((entity: HeroEntity) => {
            result = entity.pay(this.cost)
            return entity;
        });
        if (!result) return false;

        for(let action of this._actions) {
            action.strategy!(this, by,
                this.attackedTiles(by.tile as Coordinate, to, by.gameManager.board),
                action.args);
        }

        return result;
    }

    targetableTiles(from: Coordinate, board: Board, filter: Coordinate[]): Coordinate[] {
        const map: Node[][] = board.mapNodes;
        let targetable: Coordinate[] = [...map.flat()]
            .filter((n: Coordinate) => inRange(this.targetDistanceStrategy(from, n),
                this.minimalRangeTarget, this.maximalRangeTarget));

        return targetable
    }

    attackedTiles(from: Coordinate, to: Coordinate, board: Board): Coordinate[] {
        const map: Node[][] = board.mapNodes;
        let attacked: Coordinate[] = [...map.flat()]
            .filter((n: Coordinate) => inRange(this.attackedDistanceStrategy(to, n),
                this.minimalRangeAttacked, this.maximalRangeAttacked));

        return attacked
    }
}