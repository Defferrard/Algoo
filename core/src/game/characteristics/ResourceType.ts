import {Color} from "../Color";

export enum ResourceType {
    HEALTH = "HP",
    STAMINA = "SP"
}

export const RESSOURCES_COLOR: { [key in ResourceType]?: Color } = {
    [ResourceType.HEALTH]: Color.RED,
    [ResourceType.STAMINA]: Color.GREEN
}