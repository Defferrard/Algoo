<script lang="ts">
    import {findPath} from "$lib/board/pathfinding/pathfinding";
    import {getVisibles} from "$lib/board/pathfinding/visible";
    import {Board, Coordinate, Tile, TileType} from "$lib/board/";
    import {getAccessibles} from "$lib/board/pathfinding/accessibleTiles";
    import {BoardComponent, HeroIndicator} from "$lib/components/";
    import {display, movementCost} from "$lib/components/indicators/movementcostindicator";
    import {Hero, Team} from "$lib/game/";
    import UIBoard, {generateRandomBoard} from "$lib/components/game/UIBoard";
    import type {Readable} from "svelte/store";
    import {Color} from "$lib/components/Color";

    const board: UIBoard = generateRandomBoard(15, 15, 0.1);
    const animating: Readable<boolean> = board.animating;
    const teams: Team[] = [
        new Team(Color.RED, "red"),
        new Team(Color.BLUE, "blue")
    ];
    for (let i = 0; i < 6; i++) {
        new Hero(teams[i % 2], `Number ${i}`, `Of the ${teams[i % 2].name} team`, [],
            {
                maxStamina: Math.ceil(Math.random() * 25),
                maxHealth: Math.ceil(Math.random() * 25),
                strength: Math.ceil(Math.random() * 25),
                resistance: Math.ceil(Math.random() * 25),
                durability: Math.ceil(Math.random() * 25)
            },
            new Coordinate(i, 0), board);
    }

    let currentHero: Readable<Hero | undefined> = board.currentHero

    let path: Coordinate[] = [];
    let visibles: Coordinate[] = [];
    let accessible: Coordinate[] = [];


    let active: Coordinate | undefined;

    $: {
        visibles = getVisibles($currentHero!.team.heroes.map((hero: Hero) => hero.tile), board)
        if($animating){
            accessible = [];
        }else{
            accessible = getAccessibles($currentHero!.tile, $currentHero!.stamina, board, visibles)
        }

        if (
            active
            && !active.equals($currentHero!.tile)
            && accessible.some((c: Coordinate) => c.equals(active as Coordinate))
        ) {
            if (path.some((c: Coordinate) => c.equals(active as Coordinate))) {
                // If the path makes a loop, cut it to the active tile
                while(!path[0].equals(active)) {
                    path.shift();
                }
            } else if (path.length > 0
                && active.neighbors.some((n => n.equals(path[0])))
                && board.getPathCost(path) + board.getTileByCoordinate(active)?.movementCost! <= $currentHero!.stamina
            ) {
                // If the active tile is simply a neighbor of the first tile of the path, add it to the path
                path = [active, ...path];
            } else {
                // Otherwise, find the new shortest path
                path = findPath($currentHero!.tile, active, board, accessible);
            }
            movementCost.set(board.getPathCost(path));

            display.set(path.length > 0);
        } else {
            active = undefined;
            path = [];
            movementCost.set(0);
            display.set(false);
        }
    }

    function nextTurn() {
        board.nextTurn();
    }

    function hover(x: number, y: number) {
        clear();
        let tile: Tile = board.getTile(x, y);
        if (accessible.some((c: Coordinate) => c.equals(new Coordinate(x, y)))) {
            active = new Coordinate(x, y);
        } else {
            clear();
        }
    }

    function clear() {
        active = undefined;
    }

    function onAction(x: number, y: number,) {
        board.moveHero($currentHero!, path);
    }

    let isConsuming = false;

    function consumePath() {
        // if (!isConsuming) {
        //     active = undefined;
        //     accessible = [];
        //     isConsuming = true;
        //     consume();
        // }
    }

    function consume() {
        // if (currentPath.length > 0) {
        //     hero.tile = board.getTileByCoordinate(currentPath.pop()!);
        //     setTimeout(consume, 100)
        // } else {
        //     hero.tile = board.getTileByCoordinate(from);
        //     heroIndex++;
        //     isConsuming = false;
        //     accessible = getAccessibles(heroes[heroIndex%heroes.length].coordinate,
        //         heroes[heroIndex%heroes.length].stamina, board, visibles);
        // }
        // visibles = getVisibles(heroes.map((h)=>h.coordinate), board);
    }
</script>

<flex style:display="flex"
      style:justify-content="center"
      style:align-items="center"
      style:height="100vh"
      style:width="100vw">
    <BoardComponent {...{board, path, active, accessible, visibles}}
               on:click={(event)=>onAction(event.detail.x,event.detail.y)}
               on:rightclick={(event)=>{nextTurn()}}
               on:hovertile={(event)=>hover(event.detail.x,event.detail.y)}
               on:exit={()=>clear()}/>
</flex>

<!--<HeroIndicator hero={activeHero}/>-->
<HeroIndicator hero={board.targetHero}/>