import { Entity, SimpleCoordinate, Tile } from '../board';
import { ResourceType, Resources, Spell } from '../game';

type ActionArgs = { [key in string]: any };
export type ActionResume = {
  update?: {
    coordinate: SimpleCoordinate;
    type: ResourceType;
    value: number;
  }[];
};
export type ActionStrategyCallable = (
  spell: Spell,
  by: Entity<Resources>,
  to: Tile[],
  args: ActionArgs,
) => ActionResume;

export enum ActionStrategy {
  UPDATE_RESSOURCE = 'updateRessource',
}

export const ACTION_STRATEGIES: Record<ActionStrategy, ActionStrategyCallable> = {
  [ActionStrategy.UPDATE_RESSOURCE]: (spell: Spell, by: Entity<Resources>, targets: Tile[], args: ActionArgs) => {
    const ACTION_RESUME: ActionResume = { update: [] };
    for (let target of targets) {
      const VALUE = target.entity?.updateResource(args.type! as ResourceType, (value: number) => value + args.value!);
      if (VALUE !== undefined) ACTION_RESUME.update?.push({ coordinate: target, type: args.type!, value: VALUE! });
    }

    return ACTION_RESUME;
  },
};
