import { TileType } from '../board';
import { DTO } from './DTO';
import { TeamDTO } from './TeamDTO';
import { IsEnum, ValidateNested } from 'class-validator';

export class GameManagerDTO extends DTO {
  // @IsEnum(TileType, { each: true })
  tiles: TileType[][];

  @ValidateNested({ each: true })
  teams: TeamDTO[];
}
