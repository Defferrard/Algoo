import { TileType } from '../board';
import { DTO } from './DTO';
import { TeamDTO } from './TeamDTO';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

export class GameManagerDTO extends DTO {
  @Type(() => TeamDTO)
  tiles: TileType[][];

  @ValidateNested({ each: true })
  @Type(() => TeamDTO)
  teams: TeamDTO[];
}
