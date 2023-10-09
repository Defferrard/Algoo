import type {Coordinate} from "../../board";

export type DistanceStrategy = (from: Coordinate, to: Coordinate) => number;

export enum DistanceStrategyType {
    MOVEMENT = "movement",
    PYTHAGOREAN = "pythagorean",
    MONO = "mono",
    DIAGONAL = "diagonal",
    SQUARE = "square"
}

export const distanceStrategies: Record<DistanceStrategyType, DistanceStrategy> = {
    [DistanceStrategyType.MOVEMENT]:
        (from: Coordinate, to: Coordinate): number =>
            Math.abs(from.x - to.x) + Math.abs(from.y - to.y),

    [DistanceStrategyType.PYTHAGOREAN]:
        (from: Coordinate, to: Coordinate): number =>
            Math.sqrt(Math.pow(from.x - to.x, 2) + Math.pow(from.y - to.y, 2)),

    [DistanceStrategyType.MONO]:
        (from: Coordinate, to: Coordinate): number =>
            from.equals(to) ? 0 : Infinity,

    [DistanceStrategyType.DIAGONAL]:
        (from: Coordinate, to: Coordinate): number =>
            Math.max(Math.abs(from.x - to.x), Math.abs(from.y - to.y)),

    [DistanceStrategyType.SQUARE]:
        (from: Coordinate, to: Coordinate): number =>
            Math.pow(from.x - to.x, 2) + Math.pow(from.y - to.y, 2)
}