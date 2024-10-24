import { TeamDTO, buildDTO } from '../dto';
import { Color } from '../game';
import { Type } from '../utils/Type';
import { randomFromEnum } from '../utils/randomFromEnum';
import { heroFactory } from './HeroFactory';
import { v4 as uuid } from 'uuid';

export async function teamFactory(base?: Partial<Type<TeamDTO>>) {
  return await buildDTO(TeamDTO, {
    color: randomFromEnum(Color),
    uuid: uuid(),
    heroes: await Promise.all([heroFactory(), heroFactory(), heroFactory()]),
    ...base,
  });
}
