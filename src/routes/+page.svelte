<script lang="ts">
    import Coordinate from "$lib/board/Coordinate";
    import {findPath} from "$lib/board/pathfinding/pathfinding";
    import {getVisibles} from "$lib/board/pathfinding/visible";
    import {receive, send} from "$lib/animations/translate";
    import Board from "$lib/board/Board";
    import {TileType} from "$lib/board/Tile";
    import {movementCostIndicator, movementCost, display} from "$lib/components/movementCostIndicator/index";

    let from: Coordinate = new Coordinate(0, 0);
    let to: Coordinate | undefined = undefined;
    let pos: Coordinate = from;

    let width = 40;
    let height = 20;
    let map: TileType[][] = [];
    for (let y = 0; y < height; y++) {
        map[y] = new Array(width);
        for (let x = 0; x < width; x++) {
            map[y][x] = Math.random() < 0.0 ? TileType.Wall : TileType.Floor;
        }
    }

    let board: Board = new Board(map);

    let path: Coordinate[] = [];
    let visibles: Coordinate[] = getVisibles([pos], board);

    let currentPath: Coordinate[] = [];
    let closedList: Coordinate[] = [];
    let openList: Coordinate[] = [];

    $: if(path.length > 0){
        display.set(true);
    } else {
        display.set(false);
    }

    function mouseOverCell(x: number, y: number, cost: number) {
        if (cost < 0 || isConsuming) {
            return;
        }
        to = new Coordinate(x, y);
        [path, openList, closedList] = findPath(from, to, board);
        movementCost.set(path
            .map((coordinate: Coordinate) => map[coordinate.y][coordinate.x])
            .reduce((accumulator: number, cost: number) => accumulator + cost, 0));
    }

    function mouseExitCell(x: number, y: number, cost: number) {
        to = undefined;
        [path, openList, closedList] = [[],[],[]];
        movementCost.set(0);
    }

    function selectCell(x: number, y: number, cost: number) {
        // pos = new Coordinate(-1, -1);
        if (cost < 0 || isConsuming) {
            return;
        }
        from = new Coordinate(x, y);
        currentPath = [...currentPath, ...path];
        to = undefined;
        [path, openList, closedList] = [[],[],[]];
        consumePath();
    }


    let isConsuming = false;

    function consumePath() {
        if (!isConsuming) {
            isConsuming = true;
            consume();
        }
    }

    function consume() {
        if (currentPath.length > 0) {
            pos = currentPath.pop()!;
            setTimeout(consume, 50)
        } else {
            pos = from;
            isConsuming = false;
        }
        visibles = getVisibles([pos], board);
    }

    function swapTile(x:number, y:number){
        map[y][x] = map[y][x] === TileType.Floor ? TileType.Wall : TileType.Floor;
        board = new Board(map);
    }
</script>

FROM : {from}
TO : {to}
PATH : {path.length}
<table>
    {#each map as row, y}
        <tr>
            {#each row as cost, x}
                    <td class:blue={path.some((c) => c.is(x, y))}
                        class:gray={!visibles.some((c) => c.is(x, y))}
                        class:black={cost<0}
                        on:click={()=>selectCell(x,y, cost)}
                        on:mouseenter={()=>mouseOverCell(x,y, cost)}
                        on:mouseleave={()=> mouseExitCell(x,y, cost)}
                        on:contextmenu|preventDefault={()=>swapTile(x,y)}
                        use:movementCostIndicator>
                        {#if pos.is(x, y)}
                            <div in:receive="{{key: 0}}" out:send="{{key: 0}}"
                                 style:background-color="red" style:height="100%" style:width="100%">
                            </div>
                        {/if}
                    </td>
            {/each}
        </tr>
    {/each}
</table>

<style>
    table {
        border-collapse: collapse;
    }

    tr:nth-of-type(even) td:nth-of-type(even),
    tr:nth-of-type(odd) td:nth-of-type(odd) {
        /*background-color: #e0e0e0;*/
    }

    td {
        border: 1px solid black;
        padding: 5px;
        height: 1em;
        width: 1em;
        text-align: center;
    }

    .yellow {
        background-color: yellow;
    }

    .pink {
        background-color: pink;
    }



    .red {
        background-color: red;
    }

    .green {
        background-color: green;
    }
    .gray {
        background-color: gray;
    }

    .black {
        background-color: black;
        color: white;
    }
    .blue {
        background-color: blue;
    }

</style>