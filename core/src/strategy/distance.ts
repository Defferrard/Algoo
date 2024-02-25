import type {Coordinate} from "../board";

export type DistanceStrategyCallable = (from: Coordinate, to: Coordinate) => number;

export enum DistanceStrategy {
    MOVEMENT = "movement",
    PYTHAGOREAN = "pythagorean",
    MONO = "mono",
    DIAGONAL = "diagonal",
    SQUARE = "square"
}

export const DISTANCE_STRATEGIES: Record<DistanceStrategy, DistanceStrategyCallable> = {
    [DistanceStrategy.MOVEMENT]:
        (from: Coordinate, to: Coordinate): number =>
            Math.abs(from.x - to.x) + Math.abs(from.y - to.y),

    [DistanceStrategy.PYTHAGOREAN]:
        (from: Coordinate, to: Coordinate): number =>
            Math.sqrt(Math.pow(from.x - to.x, 2) + Math.pow(from.y - to.y, 2)),

    [DistanceStrategy.MONO]:
        (from: Coordinate, to: Coordinate): number =>
            from.equals(to) ? 0 : Infinity,

    [DistanceStrategy.DIAGONAL]:
        (from: Coordinate, to: Coordinate): number =>
            Math.max(Math.abs(from.x - to.x), Math.abs(from.y - to.y)),

    [DistanceStrategy.SQUARE]:
        (from: Coordinate, to: Coordinate): number =>
            Math.pow(from.x - to.x, 2) + Math.pow(from.y - to.y, 2)
}