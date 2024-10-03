import { CoordinateDTO } from './CoordinateDTO';
import { DTO } from './DTO';
import { IsNotEmptyObject, IsNumber, ValidateNested } from 'class-validator';

export class CastSpellDTO extends DTO {
  @ValidateNested()
  @IsNotEmptyObject()
  target: CoordinateDTO;

  @IsNumber()
  spellId: number;
}
