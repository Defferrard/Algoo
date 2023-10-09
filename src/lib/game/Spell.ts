import type {Color} from "../components/Color";
import type {Coordinate, Board} from "../board/";
import type Node from "../board/pathfinding/Node";
import {inRange} from "../utils/Functions";
import type {DistanceStrategy} from "../pattern/strategy/distance";
import {distanceStrategies} from "../pattern/strategy/distance";
import type {Resources, HeroEntity, Entity} from "../game";
import type {SpellObject} from "../beans/spells";

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
    }

    cast(by: HeroEntity, to: Coordinate): boolean {
        let result: boolean = true;
        by.update((entity: Entity) => {
            result = entity.pay(this.cost)
            return entity;
        });
        if (!result) return false;

        by.gameManager.board.getTileByCoordinate(to).entity?.update((entity: Entity) => {
            return entity;
        });

        return result;
    }

    targetableTiles(from: Coordinate, board: Board, filter: Coordinate[]): Coordinate[] {
        const map: Node[][] = board.mapNodes;
        let targetable: Coordinate[] = [...map.flat()]
            .filter((n: Coordinate) => inRange(this.targetDistanceStrategy(from, n),
                this.minimalRangeTarget, this.maximalRangeTarget));

        return targetable
    }

    attackedTiles(from: Coordinate, board: Board): Coordinate[] {
        const map: Node[][] = board.mapNodes;
        let attacked: Coordinate[] = [...map.flat()]
            .filter((n: Coordinate) => inRange(this.attackedDistanceStrategy(from, n),
                this.minimalRangeAttacked, this.maximalRangeAttacked));

        return attacked
    }
}