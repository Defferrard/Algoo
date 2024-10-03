import { TileType } from '../board';
import { DTO } from './DTO';
import { TeamDTO } from './TeamDTO';
import { ValidateNested } from 'class-validator';

export class GameManagerDTO extends DTO {
  @ValidateNested()
  tiles: TileType[][];

  @ValidateNested()
  teams: TeamDTO[];
}
