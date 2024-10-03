import {SimpleCoordinate, Entity} from "../board";
import {Resources} from "../game";

export class OutOfBoundsException extends Error {
    constructor(coordinate: SimpleCoordinate) {
        super(`Coordinate Out of Bounds: ${coordinate}.`);
    }
}

export class EntityAlreadyExistsException extends Error {
    constructor(entity: Entity<Resources>, coordinate: SimpleCoordinate) {
        super(`Entity ${entity.uuid} already exists at coordinate: ${coordinate}.`);
    }
}

export class EntityNotExistsException extends Error {
    constructor(entity: Entity<Resources>) {
        super(`Entity ${entity.uuid} do not exists.`);
    }
}

export class TileUnavailableException extends Error {
    constructor(coordinate: SimpleCoordinate) {
        super(`Tile at coordinate ${coordinate} is occupied.`);
    }
}
