import { SpellDTO, buildDTO } from '../dto';
import { Color } from '../game';
import { DistanceStrategy } from '../strategy';
import { randomFromEnum } from '../utils/randomFromEnum';

export function spellFactory(base: Partial<SpellDTO>): SpellDTO {
  return buildDTO(SpellDTO, {
    name: '',
    color: randomFromEnum(Color),
    iconPath: '',

    minimalRangeTarget: 0,
    maximalRangeTarget: 1,
    targetDistanceStrategy: randomFromEnum(DistanceStrategy),

    minimalRangeAttacked: 0,
    maximalRangeAttacked: 1,
    attackedDistanceStrategy: randomFromEnum(DistanceStrategy),

    cost: {},
    actions: [],
  });
}
