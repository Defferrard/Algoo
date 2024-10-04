import { CoordinateDTO } from './CoordinateDTO';
import { UuidDTO } from './UuidDTO';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

export class MoveEntityDTO extends UuidDTO {
  @ValidateNested({ each: true })
  @Type(() => CoordinateDTO)
  path: CoordinateDTO[];
}
