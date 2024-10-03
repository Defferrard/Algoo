import { Coordinate, type SimpleCoordinate } from '../board';

export type DistanceStrategyCallable = (from: SimpleCoordinate, to: SimpleCoordinate) => number;

export enum DistanceStrategy {
  MOVEMENT = 'movement',
  PYTHAGOREAN = 'pythagorean',
  MONO = 'mono',
  DIAGONAL = 'diagonal',
  SQUARE = 'square',
}

export const DISTANCE_STRATEGIES: Record<DistanceStrategy, DistanceStrategyCallable> = {
  [DistanceStrategy.MOVEMENT]: (from, to): number => Math.abs(from.x - to.x) + Math.abs(from.y - to.y),

  [DistanceStrategy.PYTHAGOREAN]: (from, to): number =>
    Math.sqrt(Math.pow(from.x - to.x, 2) + Math.pow(from.y - to.y, 2)),

  [DistanceStrategy.MONO]: (from, to): number => (new Coordinate(from).equals(to) ? 0 : Infinity),

  [DistanceStrategy.DIAGONAL]: (from, to): number => Math.max(Math.abs(from.x - to.x), Math.abs(from.y - to.y)),

  [DistanceStrategy.SQUARE]: (from, to): number => Math.pow(from.x - to.x, 2) + Math.pow(from.y - to.y, 2),
};
