import type {HeroDTO, CompleteHeroDTO, SpellDTO} from "@defferrard/algoo-core/src/game";
import {getSpell} from "$lib/beans/spells";

export async function getHero(name: string): Promise<HeroDTO> {
    // We can use .ts here, because the compiler will transform it to .js
    return (await import(`./heroes/${name.toLowerCase()}.ts`)).default
}

export async function getCompleteHero(name: string): Promise<CompleteHeroDTO> {
    const HERO: HeroDTO = await getHero(name);
    const SPELLS: SpellDTO[] = []
    for (const spellName of HERO.spells) {
        SPELLS.push(await getSpell(spellName))
    }
    return {
        ...HERO,
        spells: SPELLS
    }
}