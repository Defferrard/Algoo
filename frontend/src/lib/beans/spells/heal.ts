import icon from '$lib/assets/spells/heal.svg';
import { Color, ResourceType, SpellDTO } from '@defferrard/algoo-core/src/game/';
import { ActionStrategy, DistanceStrategy } from '@defferrard/algoo-core/src/strategy/';
import { Type } from '@defferrard/algoo-core/src/utils/Type';

const SPELL: Type<SpellDTO> = {
  name: 'Heal',
  color: Color.PINK,
  iconPath: icon,

  minimalRangeTarget: 1,
  maximalRangeTarget: 5,
  targetDistanceStrategy: DistanceStrategy.MOVEMENT,

  minimalRangeAttacked: 0,
  maximalRangeAttacked: 0,
  attackedDistanceStrategy: DistanceStrategy.MONO,
  cost: {
    [ResourceType.STAMINA]: 7,
  },

  actions: [
    {
      type: ActionStrategy.UPDATE_RESSOURCE,
      args: { value: 5, type: ResourceType.HEALTH },
    },
  ],
};

export default SPELL;
