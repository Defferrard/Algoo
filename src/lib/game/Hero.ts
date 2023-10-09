import type {StandardCharacteristics, Spell} from "./";

export default class Hero {
    readonly name: string;
    readonly title: string;
    readonly characteristics: StandardCharacteristics;
    readonly spells: Spell[];


    constructor(name: string, title: string, characteristics: StandardCharacteristics, spells: Spell[]) {
        this.name = name;
        this.title = title;
        this.characteristics = characteristics;
        this.spells = spells;
    }
}