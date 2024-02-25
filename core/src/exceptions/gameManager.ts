import {Team} from "../game";
import {Entity} from "../board";

export class TeamAlreadyExistsException extends Error {
    constructor(team: Team) {
        super(`Team ${team.name} already exists on the game.`);
    }
}

export class TeamNotExistsException extends Error {
    constructor(team: Team) {
        super(`Team ${team.name} do not exists.`);
    }
}

export class TeamNotEmptyException extends Error {
    constructor(team: Team) {
        super(`Team ${team.name} is not empty.`);
    }
}

export class InvalidEntityException extends Error {
    constructor(entity: Entity<any>) {
        super(`Invalid entity ${entity.uuid}.`);
    }
}