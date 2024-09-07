import { SpellDTO } from '@defferrard/algoo-core/src/dto';
import type { Type } from '@defferrard/algoo-core/src/utils/Type';

export async function getSpell(name: string): Promise<SpellDTO> {
  // We can use .ts here, because the compiler will transform it to .js
  const file: Type<SpellDTO> = (await import(`./spells/${name.toLowerCase()}.ts`)).default;
  const baseDTO = new SpellDTO();
  return Object.assign(baseDTO, file);
}
