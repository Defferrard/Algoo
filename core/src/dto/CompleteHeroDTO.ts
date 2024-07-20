import { BaseHeroDTO, SpellDTO } from './';
import { ValidateNested } from 'class-validator';

export class CompleteHeroDTO extends BaseHeroDTO {
  @ValidateNested({ each: true })
  spells: SpellDTO[];
}
