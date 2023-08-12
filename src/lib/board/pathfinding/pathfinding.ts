import {orderBy} from "lodash";
import type Coordinate from "../Coordinate";
import type Node from "./Node";
import type Board from "../Board";


export function findPath(from: Coordinate, to: Coordinate, board: Board, filter: Coordinate[]): [
    path: Coordinate[],
    openList: Coordinate[],
    closedList: Coordinate[]
] {
    let openList: Node[] = []; // Open list is the next set of tiles to evaluate
    const closedList: Node[] = []; // Closed list is the set of tiles already evaluated
    const map: Node[][] = board.mapNodes;

    // Get the minimal value of the mapModel greater than 0 for optimization by heuristic calculation
    const minimalMovementCost = board.minimalMovementCost;

    let current: Node = map[from.y][from.x]; // Start at the starting tile
    current.g = 0;
    openList.push(current); // Add the starting tile to the open list

    while (!current.equals(to)) {
        current = openList[0];
        // Move the current tile from the open list to the closed list
        openList.splice(openList.indexOf(current), 1);
        closedList.push(current);

        if (!filter?.some(c => c.equals(current))) {
            continue;
        }

        checkNeighbors(current, getNeighbors(current, map), openList, closedList);

        if (openList.length === 0) {
            return [[], openList, closedList];
        }
        openList = orderedOpenList(openList, to, minimalMovementCost);
    }

    return [unwindPath(current), openList, closedList];
}

function orderedOpenList(openList: Node[], to: Coordinate, minimalMovementCost: number): Node[] {
    return orderBy(openList, [
        (n: Node) =>
            n.g + heuristic(n, to, minimalMovementCost)
    ])
}

function unwindPath(node: Node): Coordinate[] {
    const path: Coordinate[] = []; // Path is the set of tiles to get from start to finish
    while (node.parent) {
        path.push(node);
        node = node.parent;
    }
    return path;
}

export function checkNeighbors(current: Node, neighbors: Node[], openList: Node[], closedList: Node[]) {
    for (const neighbor of neighbors) {
        let movementCost = current.g + neighbor.cost;
        if (movementCost < neighbor.g) {
            neighbor.parent = current;
            if (!openList.some(n => n.equals(neighbor)) &&
                !closedList.some(n => n.equals(neighbor))) {
                openList.push(neighbor);
            }
        }
    }
}

export function getNeighbors(node: Node, nodes: Node[][]): Node[] {
    // TODO : Optimize this
    const neighbors: Node[] = [];

    const width = nodes[0].length;
    const height = nodes.length;

    for (let i = 0; i < 4; i++) {
        let direction = (i >> 1) * 2 - 1;
        let x = node.x + (i % 2) * direction;
        let y = node.y + ((i + 1) % 2) * direction;
        if (x >= 0 && x < width && y >= 0 && y < height && nodes[y][x].cost >= 0) {
            neighbors.push(nodes[y][x]);
        }
    }

    // Filter out neighbors that are out of map
    return neighbors;
}

function heuristic(from: Coordinate, to: Coordinate, minimalMovementCost: number = 0): number {
    return (Math.abs(from.x - to.x) + Math.abs(from.y - to.y)) * minimalMovementCost;
}