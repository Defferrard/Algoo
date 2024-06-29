import { Board, Coordinate, SimpleCoordinate } from '../board/';
import type { Node } from './';
import { checkNeighbors, getNeighbors } from './';

export function getAccessibles(
  from: SimpleCoordinate,
  maxCost: number,
  board: Board,
  filter: SimpleCoordinate[],
): SimpleCoordinate[] {
  const accessible: SimpleCoordinate[] = [];
  const map: Node[][] = board.mapNodes;

  let openList: Node[] = []; // Open list is the next set of tiles to evaluate
  const closedList: Node[] = []; // Closed list is the set of tiles already evaluated

  let current: Node = map[from.y][from.x]; // Start at the starting tile
  current.g = 0;
  openList.push(current); // Add the starting tile to the open list

  while (openList.length > 0) {
    current = openList[0];
    // Move the current tile from the open list to the closed list
    openList.splice(openList.indexOf(current), 1);
    closedList.push(current);
    if (current.g <= maxCost && filter?.some((otherCoordinate) => Coordinate.equals(otherCoordinate, current))) {
      accessible.push(current);
      checkNeighbors(current, getNeighbors(current, map), openList, closedList);
    }
  }

  // Remove the starting tile from the accessible tiles
  return accessible;
}
