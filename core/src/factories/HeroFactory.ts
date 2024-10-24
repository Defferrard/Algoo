import { CompleteHeroDTO, buildDTO } from '../dto';
import { ResourceType, Stance } from '../game';
import { Skin } from '../game/hero/Skin';
import { Type } from '../utils/Type';
import { randomFromEnum } from '../utils/randomFromEnum';
import { spellFactory } from './SpellFactory';

export async function heroFactory(base?: Partial<Type<CompleteHeroDTO>>) {
  return await buildDTO(CompleteHeroDTO, {
    // name: 'Generic Hero Name',
    name: randomFromEnum(Skin),
    title: 'Generic Title',
    characteristics: {
      [ResourceType.HEALTH]: Math.round(Math.random() * 5 + 5),
      [ResourceType.STAMINA]: Math.round(Math.random() * 5 + 5),
      strength: Math.round(Math.random() * 5 + 5),
      resistance: Math.round(Math.random() * 5 + 5),
      durability: Math.round(Math.random() * 5 + 5),
    },
    stance: randomFromEnum(Stance),
    spells: await Promise.all([
      spellFactory(),
      spellFactory(),
      spellFactory(),
      spellFactory(),
      spellFactory(),
      spellFactory(),
      spellFactory(),
      spellFactory(),
      spellFactory(),
    ]),
    ...base,
  });
}
