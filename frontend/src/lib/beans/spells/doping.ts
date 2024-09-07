import icon from '$lib/assets/spells/doping.svg';
import { Color, ResourceType, SpellDTO } from '@defferrard/algoo-core/src/game/';
import { ActionStrategy, DistanceStrategy } from '@defferrard/algoo-core/src/strategy/';
import { Type } from '@defferrard/algoo-core/src/utils/Type';

const SPELL: Type<SpellDTO> = {
  name: 'Doping',
  color: Color.YELLOW,
  iconPath: icon,

  minimalRangeTarget: 0,
  maximalRangeTarget: 1,
  targetDistanceStrategy: DistanceStrategy.MOVEMENT,

  minimalRangeAttacked: 0,
  maximalRangeAttacked: 0,
  attackedDistanceStrategy: DistanceStrategy.MONO,
  cost: {
    [ResourceType.HEALTH]: 2,
  },

  actions: [
    {
      type: ActionStrategy.UPDATE_RESSOURCE,
      args: { value: 2, type: ResourceType.STAMINA },
    },
  ],
};

export default SPELL;
