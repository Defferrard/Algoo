import { BaseCoordinate } from '../board';
import { DTO } from './DTO';
import { IsInt, IsPositive } from 'class-validator';

export class CoordinateDTO extends DTO implements BaseCoordinate {
  @IsInt()
  x: number;

  @IsInt()
  y: number;
}
