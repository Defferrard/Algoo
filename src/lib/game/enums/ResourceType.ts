import {Color} from "../../components/Color";

export enum ResourceType {
    HEALTH = "HP",
    STAMINA = "SP"
}

export const ResourceColor: { [key in ResourceType]?: Color } = {
    [ResourceType.HEALTH]: Color.RED,
    [ResourceType.STAMINA]: Color.GREEN
}