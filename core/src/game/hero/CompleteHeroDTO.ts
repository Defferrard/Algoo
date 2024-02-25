import {HeroDTO, SpellDTO} from "../";

export type CompleteHeroDTO = Omit<HeroDTO, "spells"> & {
    spells: SpellDTO[]
}