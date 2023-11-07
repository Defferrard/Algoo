import {v4 as uuidV4} from "uuid";
import type {Coordinate, Tile} from "../../board";
import type {ResourceType, GameManager, Resources} from "../";
import type {Writable} from "svelte/store";
import {show} from "../../components/indicators/temporaryvalueindicator";
import {ResourceColor} from "../";
import {shake} from "../../animations/shake";

/**
 * An entity is an object that can be placed on the board.
 */
export default class Entity<R extends Resources> {
    readonly gameManager: GameManager;
    readonly uuid: string = uuidV4();
    readonly resources: R;

    tile?: Tile;

    constructor(coordinate: Coordinate, gameManager: GameManager, resources: R) {
        this.gameManager = gameManager;
        this.tile = gameManager.board.getTile(coordinate.x, coordinate.y);
        this.resources = resources;
        gameManager.pushEntity(this, coordinate.x, coordinate.y)
    }

    updateResource(type: ResourceType, updateFunction: (value: number) => number): void {
        const oldValue = this.resources[type]!;
        this.resources[type] = updateFunction(this.resources[type]!);
        const diff = this.resources[type]! - oldValue;

        if (this.resources[type]! < 0) {
            this.resources[type] = 0;
        }
        show(this.tile!, diff, ResourceColor[type]!)
        if (diff < 0) shake(500,{x:diff*10,y:0});

    }

    update(updateFunction: (entity: Entity<R>) => Entity<R>): void {
        this.gameManager.findEntityByUuid(this.uuid)!.set(updateFunction(this));
    }

    getWritable(): Writable<Entity<Resources>> {
        return this.gameManager.findEntityByUuid(this.uuid)!;
    }

    pay(resources: Resources): boolean {
        if (!this.has(resources)) {
            return false
        }
        Object.keys(resources).forEach((resourceType) => {
            const type: ResourceType = resourceType as ResourceType;
            this.resources[type]! -= resources[type]!;
        })
        return true;
    }

    has(resources: Resources): boolean {
        return Object.keys(resources).every((resourceType: string) => {
            const type: ResourceType = resourceType as ResourceType;
            return this.resources[type]! >= resources[type]!;
        })
    }
}