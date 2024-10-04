import { BaseHeroDTO, SpellDTO } from './';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

export class CompleteHeroDTO extends BaseHeroDTO {
  @ValidateNested({ each: true })
  @Type(() => SpellDTO)
  spells: SpellDTO[];
}
