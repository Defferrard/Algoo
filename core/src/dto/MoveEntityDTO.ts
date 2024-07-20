import { CoordinateDTO } from './CoordinateDTO';
import { UuidDTO } from './UuidDTO';
import { ValidateNested } from 'class-validator';

export class MoveEntityDTO extends UuidDTO {
  @ValidateNested({ each: true })
  path: CoordinateDTO[];
}
