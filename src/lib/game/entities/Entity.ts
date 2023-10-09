import {v4 as uuidV4} from "uuid";
import type {Coordinate, Tile} from "../../board";
import type {ResourceType, GameManager, Resources} from "../";

/**
 * An entity is an object that can be placed on the board.
 */
export default class Entity {
    readonly gameManager: GameManager;
    readonly uuid: string = uuidV4();
    readonly resources: Resources;

    tile?: Tile;

    constructor(coordinate: Coordinate, gameManager: GameManager, resources: Resources = {}) {
        this.gameManager = gameManager;
        this.tile = gameManager.board.getTile(coordinate.x, coordinate.y);
        this.resources = resources;
        gameManager.pushEntity(this, coordinate.x, coordinate.y)
    }

    update(updateFunction: (entity:Entity) => Entity): void {
        this.gameManager.findEntityByUuid(this.uuid)!.set(updateFunction(this));
    }

    pay(resources: Resources): boolean {
        if(!this.has(resources)){
            return false
        }
        Object.keys(resources).forEach((resourceType) => {
            const type: ResourceType = resourceType as ResourceType;
            this.resources[type]! -= resources[type]!;
        })
        return true;
    }

    has(resources: Resources): boolean {
        return Object.keys(resources).every((resourceType:string) => {
            const type: ResourceType = resourceType as ResourceType;
            return this.resources[type]! >= resources[type]!;
        })
    }
}