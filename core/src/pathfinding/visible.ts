import { Board, Coordinate, SimpleCoordinate, TileType } from '../board/';

export function getVisibles(points: SimpleCoordinate[], board: Board): SimpleCoordinate[] {
  const visibles = [...points];

  // TODO : Can we do better than this?
  // TODO : We can see through corners...
  // TODO : Idea 1 : Bresenham
  // TODO : Idea 2 : https://francescocossu.medium.com/creating-a-line-of-sight-map-c63e44973c6f
  // TODO : Idea 3 :
  // We could probably do it by using openList ? (See pathfinding...)

  const extremes: SimpleCoordinate[] = [
    ...Array.from({ length: board.height }, (_, i) => {
      return { x: 0, y: i };
    }),
    ...Array.from({ length: board.width }, (_, i) => {
      return { x: i, y: 0 };
    }),
    ...Array.from({ length: board.height }, (_, i) => {
      return { x: board.width - 1, y: i };
    }),
    ...Array.from({ length: board.width }, (_, i) => {
      return { x: i, y: board.height - 1 };
    }),
  ];

  const half: SimpleCoordinate = { x: 0.5, y: 0.5 };

  for (let from of points) {
    from = Coordinate.plus(from, half);

    for (let to of extremes) {
      const direction = new Coordinate(to).plus(half).minus(from).normalized();
      let current = from;
      let lastCurrent = from;
      let i: number = 0;
      while (!Coordinate.equals(current, to)) {
        i += 0.5;
        current = Coordinate.plusDirection(from, direction, i);
        current = Coordinate.floored(current);
        if (Coordinate.equals(current, lastCurrent)) {
          continue;
        }
        if (current.x < 0 || current.x >= board.width || current.y < 0 || current.y >= board.height) {
          current = to;
        }

        if (board.getTile(current).type === TileType.Wall) {
          break;
        } else if (!visibles.some((v) => Coordinate.equals(v, current))) {
          visibles.push(current);
        }
      }
    }
  }

  return visibles;
}
