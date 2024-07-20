import { CoordinateDTO } from './CoordinateDTO';
import { DTO } from './DTO';
import { ValidateNested } from 'class-validator';

export class CastSpellDTO extends DTO {
  @ValidateNested()
  target: CoordinateDTO;
  spellId: number;
}
