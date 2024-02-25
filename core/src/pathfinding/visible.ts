import {Coordinate, TileType, Board} from "../board/";

export function getVisibles(points: Coordinate[], board: Board): Coordinate[] {
    const visibles: Coordinate[] = [...points];

    // TODO : Can we do better than this?
    // TODO : We can see through corners...
    // TODO : Idea 1 : Bresenham
    // TODO : Idea 2 : https://francescocossu.medium.com/creating-a-line-of-sight-map-c63e44973c6f
    // TODO : Idea 3 :
    // We could probably do it by using openList ? (See pathfinding...)

    const extremes: Coordinate[] = [
        ...Array.from({length: board.height}, (_, i: number) =>
            new Coordinate({x: 0, y: i})),
        ...Array.from({length: board.width}, (_, i: number) =>
            new Coordinate({x: i, y: 0})),
        ...Array.from({length: board.height}, (_, i: number) =>
            new Coordinate({x: board.width - 1, y: i})),
        ...Array.from({length: board.width}, (_, i: number) =>
            new Coordinate({x: i, y: board.height - 1})),
    ];

    const half = new Coordinate({x: 0.5, y: 0.5});

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

                if (board.getTile(current).type === TileType.Wall) {
                    break;
                } else if (!visibles.some(v => v.equals(current))) {
                    visibles.push(current);
                }
            }
        }
    }

    return visibles;
}
