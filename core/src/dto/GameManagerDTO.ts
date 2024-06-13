import { TileType } from '../board';
import { IsArray, IsEnum } from 'class-validator';

export class GameManagerDTO {
  @IsArray()
  tiles: TileType[][];
}
