import icon from '$lib/assets/spells/toxic.svg';
import { SpellDTO } from '@defferrard/algoo-core/src/dto';
import { Color, ResourceType } from '@defferrard/algoo-core/src/game/';
import { ActionStrategy, DistanceStrategy } from '@defferrard/algoo-core/src/strategy/';
import type { Type } from '@defferrard/algoo-core/src/utils/Type';

const SPELL: Type<SpellDTO> = {
  name: 'Toxic',
  color: Color.PURPLE,
  iconPath: icon,

  minimalRangeTarget: 2,
  maximalRangeTarget: 5,
  targetDistanceStrategy: DistanceStrategy.SQUARE,

  minimalRangeAttacked: 0,
  maximalRangeAttacked: 1,
  attackedDistanceStrategy: DistanceStrategy.MOVEMENT,
  cost: {
    [ResourceType.STAMINA]: 7,
  },

  actions: [
    {
      type: ActionStrategy.UPDATE_RESSOURCE,
      args: { value: -2, type: ResourceType.HEALTH },
    },
  ],
};

export default SPELL;
