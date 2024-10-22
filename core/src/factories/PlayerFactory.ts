import { PlayerDTO, buildDTO } from '../dto';
import { Color } from '../game';
import { randomFromEnum } from '../utils/randomFromEnum';
import { v4 as uuid } from 'uuid';

export async function playerFactory(base: Partial<PlayerDTO>): Promise<PlayerDTO> {
  return await buildDTO(PlayerDTO, {
    user: {
      uuid: uuid(),
      name: 'Generic Username',
    },
    team: {
      color: randomFromEnum(Color),
      uuid: uuid(),
      heroes: [],
    },
    isReady: false,
    ...base,
  });
}
