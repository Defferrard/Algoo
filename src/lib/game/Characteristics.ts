import {ResourceType} from "./enums/ResourceType";

export type Resources = { [key in ResourceType]?: number };
export abstract class Characteristics<R extends Resources> {
    private readonly _maxResources: R;

    protected constructor(maxResources: R) {
        this._maxResources = maxResources;
    }

    buildResources(): R {
        return {...this._maxResources};
    }

    get max(): R {
        return {...this._maxResources};
    }
}

export type StandardResources = Resources & {[ResourceType.HEALTH]: number, [ResourceType.STAMINA]: number};


export class StandardCharacteristics extends Characteristics<StandardResources> {

    readonly strength: number;
    readonly resistance: number;
    readonly durability: number;

    constructor(maxResources: StandardResources, strength: number, resistance: number, durability: number) {
        super(maxResources);
        this.strength = strength;
        this.resistance = resistance;
        this.durability = durability;
    }
}