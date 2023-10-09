import type {HeroEntity} from "./";
import type {Color} from "../components/Color";

export default class Team {
    readonly color: Color;
    readonly name: string;
    private readonly _heroes: HeroEntity[] = [];

    constructor(color: Color, name: string) {
        this.color = color;
        this.name = name;
    }

    pushHero(hero: HeroEntity): void {
        this._heroes.push(hero);
    }

    get heroes(): HeroEntity[] {
        return this._heroes;
    }
}