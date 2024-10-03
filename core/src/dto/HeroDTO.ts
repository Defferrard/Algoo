import { BaseHeroDTO } from './BaseHeroDTO';
import { Length } from 'class-validator';

export class HeroDTO extends BaseHeroDTO {
  @Length(3, 20, { each: true })
  spells: string[];
}
