import type {Hero} from "./";
import type {Color} from "../components/Color";

export default class Team {
    readonly color: Color;
    readonly name: string;
    private readonly _heroes: Hero[] = [];

    constructor(color: Color, name: string) {
        this.color = color;
        this.name = name;
    }

    pushHero(hero: Hero): void {
        this._heroes.push(hero);
    }

    get heroes(): Hero[] {
        return this._heroes;
    }
}