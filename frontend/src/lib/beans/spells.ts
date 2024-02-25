import type {SpellDTO} from "@defferrard/algoo-core/src/game";

export async function getSpell(name: string): Promise<SpellDTO> {
    // We can use .ts here, because the compiler will transform it to .js
    return (await import(`./spells/${name.toLowerCase()}.ts`)).default
}