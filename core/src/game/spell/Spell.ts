import type { Color, Resources } from '../';
import type { Board, Coordinate, SimpleCoordinate } from '../../board';
import { Entity } from '../../board';
import { SpellDTO } from '../../dto';
import type { Node } from '../../pathfinding';
import type { DistanceStrategyCallable } from '../../strategy';
import { ACTION_STRATEGIES, ActionStrategy, DISTANCE_STRATEGIES } from '../../strategy';
import type { ActionResume, ActionStrategyCallable } from '../../strategy';
import { inRange } from 'lodash';

type SpellAction = {
  strategy?: ActionStrategyCallable;
  type: ActionStrategy;
  args: { [key in string]: any };
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
        args: action.args,
      };
    });
  }

  cast(by: Entity<Resources>, from: SimpleCoordinate, to: SimpleCoordinate, on: Board): ActionResume[] {
    const RESUME: ActionResume[] = [];

    if (!by.pay(this.cost)) return RESUME;

    for (let action of this._actions) {
      RESUME.push(
        action.strategy!(
          this,
          by,
          this.attackedTiles(from, to, on).map((c: Coordinate) => on.getTile(c)),
          action.args,
        ),
      );
    }

    return RESUME;
  }

  targetableTiles(from: SimpleCoordinate, board: Board, _filter: SimpleCoordinate[]): SimpleCoordinate[] {
    const map: Node[][] = board.mapNodes;
    let targetable: Coordinate[] = [...map.flat()].filter((n: Node) =>
      inRange(this.targetDistanceStrategy(from, n), this.minimalRangeTarget, this.maximalRangeTarget + 1),
    );

    return targetable;
  }

  attackedTiles(from: SimpleCoordinate, to: SimpleCoordinate, board: Board): Coordinate[] {
    const map: Node[][] = board.mapNodes;
    let attacked: Coordinate[] = [...map.flat()].filter((n: Node) =>
      inRange(this.attackedDistanceStrategy(to, n), this.minimalRangeAttacked, this.maximalRangeAttacked + 1),
    );

    return attacked;
  }
}
