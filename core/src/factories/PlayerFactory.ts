import { PlayerDTO, buildDTO } from '../dto';
import { Color } from '../game';
import { randomFromEnum } from '../utils/randomFromEnum';
import { plainToInstance } from 'class-transformer';
import { v4 as uuid } from 'uuid';

export function playerFactory(base: Partial<PlayerDTO>): PlayerDTO {
  return buildDTO(PlayerDTO, {
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
