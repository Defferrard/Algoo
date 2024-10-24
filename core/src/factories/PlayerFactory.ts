import { PlayerDTO, buildDTO } from '../dto';
import { Type } from '../utils/Type';
import { teamFactory } from './TeamFactory';
import { v4 as uuid } from 'uuid';

export async function playerFactory(base?: Partial<Type<PlayerDTO>>) {
  return await buildDTO(PlayerDTO, {
    user: {
      uuid: uuid(),
      name: 'Generic Username',
    },
    team: await teamFactory(),
    isReady: false,
    ...base,
  });
}
