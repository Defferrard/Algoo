import { getSpell } from '$lib/beans/spells';
import { CompleteHeroDTO, HeroDTO } from '@defferrard/algoo-core/src/dto';
import type { SpellDTO } from '@defferrard/algoo-core/src/dto';
import type { Type } from '@defferrard/algoo-core/src/utils/Type';

export async function getHero(name: string): Promise<HeroDTO> {
  // We can use .ts here, because the compiler will transform it to .js
  const file: Type<HeroDTO> = (await import(`./heroes/${name.toLowerCase()}.ts`)).default;
  const baseDTO = new HeroDTO();
  return Object.assign(baseDTO, file);
}

export async function getCompleteHero(name: string): Promise<CompleteHeroDTO> {
  const HERO: HeroDTO = await getHero(name);
  const SPELLS: SpellDTO[] = [];
  for (const spellName of HERO.spells) {
    SPELLS.push(await getSpell(spellName));
  }
  return Object.assign(HERO, { spells: SPELLS });
}
