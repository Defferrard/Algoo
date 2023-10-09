import {ResourceType} from "./enums/ResourceType";

export type Resources = { [key in ResourceType]?: number };
export abstract class Characteristics {
    private readonly _maxResources: Resources;

    protected constructor(maxResources: Resources) {
        this._maxResources = maxResources;
    }

    buildResources(): Resources {
        return {...this._maxResources};
    }

    get max(): Resources {
        return {...this._maxResources};
    }
}

type StandardResources = {
    [ResourceType.HEALTH]: number,
    [ResourceType.STAMINA]: number
}

export class StandardCharacteristics extends Characteristics {

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