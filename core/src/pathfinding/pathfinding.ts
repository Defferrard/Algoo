import {orderBy} from "lodash";
import type {Coordinate, Board} from "../board/";
import type {Node} from "./";


/**
 * Find the shortest path from a starting point to an ending point on a board.
 * @param from
 * @param to
 * @param board
 * @param filter The list of tiles that can be used to find the path
 */
export function findPath(from: Coordinate, to: Coordinate, board: Board, filter: Coordinate[]): Coordinate[] {
    if (!filter.some(n => n.equals(from)) && !filter.some(n => n.equals(to))) return [];

    let openList: Node[] = []; // Open list is the next set of tiles to evaluate
    const closedList: Node[] = []; // Closed list is the set of tiles already evaluated
    const map: Node[][] = board.mapNodes;

    // Get the minimal value of the mapModel greater than 0 for optimization by heuristic calculation
    const minimalMovementCost = board.minimalMovementCost;

    let current: Node = map[from.y][from.x]; // Start at the starting tile
    current.g = 0;

    while (!current.equals(to)) {
        // Move the current tile from the open list to the closed list
        closedList.push(current);
        if (filter?.some(c => c.equals(current))) {
            checkNeighbors(current, getNeighbors(current, map), openList, closedList);
            if (openList.length === 0) {
                return [];
            }
            openList = orderedOpenList(openList, to, minimalMovementCost);
        }
        current = openList.shift()!;

    }
    return unwindPath(current);
}


/**
 * Order the open list by the heuristic value of the nodes
 * @param openList
 * @param to
 * @param minimalMovementCost
 */
function orderedOpenList(openList: Node[], to: Coordinate, minimalMovementCost: number): Node[] {
    return orderBy(openList, [
        (n: Node) =>
            n.g + heuristic(n, to, minimalMovementCost)
    ])
}

/**
 * Unwind the path from the end to the start, by following the parent nodes
 * @param node The end node
 */
function unwindPath(node: Node): Coordinate[] {
    const path: Coordinate[] = []; // Path is the set of tiles to get from start to finish
    while (node.parent) {
        path.push(node);
        node = node.parent;
    }
    return path;
}

/**
 * Check the neighbors of the current node, by updating their parent if the movement cost is lower
 * and adding them to the open list if they are not already in the closed list.
 * Update the G value of the neighbors.
 *
 * @param current
 * @param neighbors
 * @param openList
 * @param closedList
 */
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

/**
 * Get the neighbors of a node, by checking the 4 adjacent tiles.
 * @param node Node to get the neighbors of
 * @param nodes Global map of nodes
 */
export function getNeighbors(node: Node, nodes: Node[][]): Node[] {
    // TODO : Optimize this
    const neighbors: Node[] = [];

    const width = nodes[0].length;
    const height = nodes.length;

    for (let i = 0; i < 4; i++) {
        let direction = (i >> 1) * 2 - 1;
        let x = node.x + (i % 2) * direction;
        let y = node.y + ((i + 1) % 2) * direction;
        if (x >= 0 && x < width && y >= 0 && y < height
            && nodes[y][x].cost >= 0) {
            neighbors.push(nodes[y][x]);
        }
    }

    // Filter out neighbors that are out of map
    return neighbors;
}

/**
 * Calculate the heuristic value of a node, by calculating the Manhattan distance between the node and the target.
 * @param from
 * @param to
 * @param minimalMovementCost
 */
function heuristic(from: Coordinate, to: Coordinate, minimalMovementCost: number = 0): number {
    return (Math.abs(from.x - to.x) + Math.abs(from.y - to.y)) * minimalMovementCost;
}