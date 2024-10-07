import { BaseCoordinate } from '../board';
import { DTO } from './DTO';
import { IsInt } from 'class-validator';

export class CoordinateDTO extends DTO implements BaseCoordinate {
  @IsInt()
  x: number;

  @IsInt()
  y: number;
}
