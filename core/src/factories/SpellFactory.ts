import { SpellDTO, buildDTO } from '../dto';
import { Color } from '../game';
import { DistanceStrategy } from '../strategy';
import { Type } from '../utils/Type';
import { randomFromEnum } from '../utils/randomFromEnum';

export async function spellFactory(base?: Partial<Type<SpellDTO>>) {
  return await buildDTO(SpellDTO, {
    name: 'flame',
    color: randomFromEnum(Color),
    iconPath: '/src/lib/assets/spells/bandage.svg',

    minimalRangeTarget: 0,
    maximalRangeTarget: 1,
    targetDistanceStrategy: randomFromEnum(DistanceStrategy),

    minimalRangeAttacked: 0,
    maximalRangeAttacked: 1,
    attackedDistanceStrategy: randomFromEnum(DistanceStrategy),

    cost: {},
    actions: [],
    ...base,
  });
}
