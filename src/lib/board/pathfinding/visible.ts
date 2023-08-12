import Coordinate from "../Coordinate";
import type Board from "../Board";

export function getVisibles(points: Coordinate[], board: Board): Coordinate[] {
    const visibles: Coordinate[] = [...points];

    // TODO : Can we do better than this?
    // TODO : We can see through corners...
    // We could probably do it by using openList ? (See pathfinding...)
    const extremes: Coordinate[] = [
        ...Array.from({length: board.height}, (_, i: number) => new Coordinate(0, i)),
        ...Array.from({length: board.width}, (_, i: number) => new Coordinate(i, 0)),
        ...Array.from({length: board.height}, (_, i: number) => new Coordinate(board.width - 1, i)),
        ...Array.from({length: board.width}, (_, i: number) => new Coordinate(i, board.height - 1)),
    ];

    const half = new Coordinate(0.5, 0.5);

    for (let from of points) {
        from = from.plus(half);
        for (let to of extremes) {
            const direction: Coordinate = to.plus(half).minus(from).normalized();
            let current: Coordinate = from;
            let lastCurrent: Coordinate = from;
            let i: number = 0;
            while (!current.equals(to)) {
                i += 0.5;
                current = from.plusDirection(direction, i).floored();
                if (current.equals(lastCurrent)) {
                    continue
                }
                if (current.x < 0 || current.x >= board.width || current.y < 0 || current.y >= board.height) {
                    current = to;
                }

                if (board.getTile(current.x, current.y).movementCost < 0) {
                    break;
                } else if (!visibles.some(v => v.equals(current))) {
                    visibles.push(current);
                }
            }
        }
    }

    return visibles;
}