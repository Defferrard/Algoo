import icon from '$lib/assets/spells/slice.svg';
import { SpellDTO } from '@defferrard/algoo-core/src/dto';
import { Color, ResourceType } from '@defferrard/algoo-core/src/game/';
import { ActionStrategy, DistanceStrategy } from '@defferrard/algoo-core/src/strategy/';
import type { Type } from '@defferrard/algoo-core/src/utils/Type';

const SPELL: Type<SpellDTO> = {
  name: 'Slice',
  color: Color.GRAY,
  iconPath: icon,

  minimalRangeTarget: 1,
  maximalRangeTarget: 1,
  targetDistanceStrategy: DistanceStrategy.MOVEMENT,

  minimalRangeAttacked: 0,
  maximalRangeAttacked: 0,
  attackedDistanceStrategy: DistanceStrategy.MONO,
  cost: {
    [ResourceType.STAMINA]: 5,
  },

  actions: [
    {
      type: ActionStrategy.UPDATE_RESSOURCE,
      args: { value: -2, type: ResourceType.HEALTH },
    },
  ],
};

export default SPELL;
