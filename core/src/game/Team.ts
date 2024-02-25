import {v4 as uuidV4} from "uuid";
import type {Color, Resources} from "./";
import type {Entity} from "../board";

export default class Team {
    readonly color: Color;
    readonly name: string;
    readonly uuid: string = uuidV4();
    private readonly _entities: Entity<Resources>[] = [];

    constructor(color: Color, name: string) {
        this.color = color;
        this.name = name;
    }

    pushEntity(entity: Entity<Resources>): void {
        this._entities.push(entity);
    }

    deleteEntity(entity: Entity<Resources>): void {
        this._entities.splice(this._entities.indexOf(entity), 1);
    }

    equals(team: Team): boolean {
        return this.uuid === team.uuid;
    }

    get entities(): Entity<Resources>[] {
        return this._entities;
    }
}