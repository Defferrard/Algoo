import type {StandardResources, Stance} from "../";

export type HeroDTO = {
    name: string,
    title: string,
    characteristics: StandardResources & {
        strength: number,
        resistance: number,
        durability: number,
    },
    spells: string[],

    stance: Stance
}