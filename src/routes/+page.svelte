<script lang="ts">

    import {findPath} from "$lib/board/pathfinding/pathfinding";
    import {getVisibles} from "$lib/board/pathfinding/visible";
    import {Coordinate, TileType} from "$lib/board/";
    import {getAccessibles} from "$lib/board/pathfinding/accessibleTiles";
    import {ActionBar, BoardComponent, HeroResume, SpellResume, TimerProgressBar} from "$lib/components/";
    import {display, movementCost} from "$lib/components/indicators/movementcostindicator";
    import {Hero, HeroEntity, Spell, StandardCharacteristics, Team, ResourceType} from "$lib/game";
    import GameManager, {generateRandomBoard} from "$lib/game/GameManager";
    import type {Readable, Writable} from "svelte/store";
    import {writable} from "svelte/store";
    import {Color, getCSS} from "$lib/components/Color";

    import {Board} from "$lib/board";
    import {delay} from "$lib/utils/Functions";
    import KeyBoardListener from "$lib/components/KeyBoardListener.svelte";
    import {spells} from "$lib/beans/spells";
    import type {Observer} from "$lib/utils/Observer";
    import {observer} from "$lib/utils/Observer";

    const gameManager: GameManager = generateRandomBoard(15, 15, 0);
    const board: Board = gameManager.board;
    const animating: Readable<boolean> = gameManager.animating;

    const teams: Team[] = [
        new Team(Color.RED, "red"),
        new Team(Color.BLUE, "blue")
    ];
    for (let i = 0; i < 2; i++) {
        const characteristics: StandardCharacteristics = new StandardCharacteristics(
            {
                [ResourceType.HEALTH]: Math.ceil(Math.random() * 25),
                [ResourceType.STAMINA]: Math.ceil(Math.random() * 25)
            },
            Math.ceil(Math.random() * 25),
            Math.ceil(Math.random() * 25),
            Math.ceil(Math.random() * 25)
        );

        const hero: Hero = new Hero(`Number ${i}`, `Of the ${teams[i % 2].name} team`,
            characteristics,
            [
                new Spell(spells["slice"]),
                new Spell(spells[Object.keys(spells)[Math.floor(Math.random() * Object.keys(spells).length)]]),
                new Spell(spells[Object.keys(spells)[Math.floor(Math.random() * Object.keys(spells).length)]])
            ]
        );
        new HeroEntity(teams[i % 2], hero,
            new Coordinate(i, 0), gameManager);
    }

    const currentHero: Readable<HeroEntity | undefined> = gameManager.currentHero
    const targetHero: Observer<HeroEntity | undefined> = observer();
    const currentSpell: Writable<Spell | undefined> = writable();

    let path: Coordinate[] = []; // The path the current hero will take
    let visibles: Coordinate[] = []; // Tiles visible by the current hero
    let markers: Coordinate[] = []; // Tiles marked by the user
    let accessible: Coordinate[] = []; // Tiles where the current hero can move
    let targetable: Coordinate[] = []; // Tiles where the current spell can be cast
    let attacked: Coordinate[] = [];


    let active: Coordinate | undefined; // The tile the mouse is hovering
    let lastHover: Coordinate | undefined; // The last tile the mouse was hovering

    $: {
        visibles = getVisibles($currentHero!.team.heroes.map((hero: HeroEntity) => hero.tile), board)
        if ($animating) {
            accessible = [];
            targetable = [];
            attacked = [];
        } else if ($currentSpell) {
            accessible = [];
            targetable = $currentSpell.targetableTiles($currentHero!.tile, board, visibles);
        } else {
            targetable = [];
            attacked = [];
            accessible = getAccessibles($currentHero!.tile, $currentHero!.resources[ResourceType.STAMINA], board, visibles)
        }

        if (
            active
            && !active.equals($currentHero!.tile)
            && accessible.some((c: Coordinate) => c.equals(active as Coordinate))
        ) {
            if (path.some((c: Coordinate) => c.equals(active as Coordinate))) {
                // If the path makes a loop, cut it to the active tile
                while (!path[0].equals(active)) {
                    path.shift();
                }
            } else if (path.length > 0
                && active.neighbors.some((n => n.equals(path[0])))
                && board.getPathCost(path) + board.getTileByCoordinate(active)?.movementCost! <= $currentHero!.resources[ResourceType.STAMINA]
            ) {
                // If the active tile is simply a neighbor of the first tile of the path, add it to the path
                path = [active, ...path];
            } else {
                // Otherwise, find the new shortest path
                path = findPath($currentHero!.tile, active, board, accessible);
            }
            movementCost.set(board.getPathCost(path));

            display.set(path.length > 0);
        } else if (active && targetable.some((c: Coordinate) => c.equals(active as Coordinate))) {
            path = [];
            attacked = $currentSpell?.attackedTiles($currentHero?.tile as Coordinate, active as Coordinate, board) || [];
            movementCost.set(0);
            display.set(false);
        } else {
            active = undefined;
            attacked = [];
            path = [];
            movementCost.set(0);
            display.set(false);
        }
    }

    function nextTurn() {
        currentSpell.set(undefined);
        gameManager.nextTurn();
    }

    function hover(x: number, y: number) {
        lastHover = new Coordinate(x, y);
        clearHover();
        if (board.getTile(x, y).type !== TileType.Wall && (
            accessible.some((c: Coordinate) => c.equals(new Coordinate(x, y)))
            || targetable.some((c: Coordinate) => c.equals(new Coordinate(x, y))))) {
            active = new Coordinate(x, y);
        }
    }

    function clearHover() {
        active = undefined;
    }

    function onAction(x: number, y: number) {
        if (!active) {
            return;
        } else if ($currentSpell) {
            $currentSpell.cast($currentHero!, new Coordinate(x, y))
            currentSpell.set(undefined);
        } else {
            gameManager.moveEntityByUUID($currentHero!.uuid, path);
        }
    }

    async function mark(x: number, y: number) {
        const coordinate: Coordinate = new Coordinate(x, y);
        markers = [...markers, coordinate]
        await delay(5000)
        markers = markers.filter((c: Coordinate) => !c.equals(coordinate));
    }

    function previewSpell(spell: Spell) {
        if ($currentSpell === spell // if already previewing the spell, cancel it
            || !$currentHero!.spells.includes(spell) // If the hero doesn't have the spell, cancel it
            || !$currentHero!.has(spell.cost)) { // if the hero doesn't have enough resources, cancel it
            currentSpell.set(undefined);
        } else {
            active = lastHover;
            currentSpell.set(spell);
        }
    }

    const colors: Color[] = [Color.GREEN, Color.CYAN, Color.BLUE, Color.PURPLE, Color.PINK, Color.RED, Color.ORANGE, Color.YELLOW];
    let colorIndex: number = Math.floor(Math.random() * colors.length);

    // Funny code to change the color of the board every 100ms
    //  setInterval(() => {
    //      colorIndex = (colorIndex + 1) % colors.length;
    //  }, 100);
</script>

<KeyBoardListener on:space={nextTurn}
                  on:digit={(event)=>previewSpell($currentHero.spells[event.detail.digit-1])}
/>

<svelte:window on:click={()=>currentSpell.set(undefined)}/>

<section style:--color={getCSS(colors[colorIndex])}>
    <board>
        <BoardComponent
                {...{gameManager, path, active, accessible, visibles, targetHero, markers, targetable, attacked}}
                on:click={(event)=>onAction(event.detail.x,event.detail.y)}
                on:rightclick={(event)=>{mark(event.detail.x,event.detail.y)}}
                on:hovertile={(event)=>hover(event.detail.x,event.detail.y)}
                on:exit={()=>{clearHover();lastHover = undefined;}}/>
    </board>


    <heroResume>
        <HeroResume hero={targetHero} stickRight/>
    </heroResume>
    <spellResume>
        <SpellResume spell={currentSpell}/>
    </spellResume>

    <bottom>
        <ActionBar
                hero={currentHero}
                spellPreview={currentSpell}
                on:spellaction={(event)=>{
                    previewSpell(event.detail.spell)
                }}
                on:endturn={()=>nextTurn()}/>
        <TimerProgressBar/>
    </bottom>
</section>

<style>
    section {
        height: 100vh;
        display: block;
    }

    board {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 80vh;
        width: 100vw;
    }

    heroResume, spellResume {
        position: absolute;
        right: 2vw;
    }

    heroResume {
        top: 10vh;
    }

    spellResume {
        top: 30vh;
    }

    bottom {
        position: absolute;
        bottom: 3vh;
        width: 100vw;
    }
</style>