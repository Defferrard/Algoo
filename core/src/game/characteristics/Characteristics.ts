import {ResourceType} from "../";

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
