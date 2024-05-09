<script async lang="ts">
    import {onMount} from "svelte";
    import type {Readable} from "svelte/store";
    import {fly} from "svelte/transition";

    import {Coordinate, TileType, Board, Entity} from "@defferrard/algoo-core/src/board/";
    import {getAccessibles, getVisibles, findPath} from "@defferrard/algoo-core/src/pathfinding";
    import {
        ResourceType,
        Color,
        generateRandomBoard,
        HeroEntity,
        Spell,
        Team
    } from "@defferrard/algoo-core/src/game/";
    import type {Resources} from "@defferrard/algoo-core/src/game/";

    import {ActionBar, BoardComponent, HeroResume, SpellResume, TimerProgressBar} from "$lib/components/";
    import {display, movementCost} from "$lib/components/indicators/movement_cost_indicator";
    import {getCSS} from "$lib/components/Color";
    import {delay} from "$lib/utils/Functions";
    import KeyBoardListener from "$lib/components/KeyBoardListener.svelte";
    import {getCompleteHero} from "$lib/beans/heroes";
    import {UIGameManager} from "$lib/game";

    const TILE_MAP: TileType[][] = generateRandomBoard(15, 15, 0.1);
    const GAME_MANAGER: UIGameManager = new UIGameManager(TILE_MAP);
    const GAME_MANAGER_STORE: Readable<UIGameManager> = GAME_MANAGER.store;
    const BOARD: Board = GAME_MANAGER.board;

    let targetEntity: Entity<Resources> | undefined;
    let currentSpell: Spell | undefined;

    let path: Coordinate[] = []; // The path the current hero will take
    let visibles: Coordinate[] = []; // Tiles visible by the current hero
    let markers: Coordinate[] = []; // Tiles marked by the user
    let accessible: Coordinate[] = []; // Tiles where the current hero can move
    let targetable: Coordinate[] = []; // Tiles where the current spell can be cast
    let attacked: Coordinate[] = [];


    let active: Coordinate | undefined; // The tile the mouse is hovering
    let lastHover: Coordinate | undefined; // The last tile the mouse was hovering

    $: if ($GAME_MANAGER_STORE.currentHero) {
        visibles = getVisibles(
            GAME_MANAGER.currentHero!.team?.entities.map((hero: HeroEntity) => BOARD.getEntityCoordinate(hero)),
            BOARD
        );

        if (GAME_MANAGER.busy) {
            accessible = [];
            targetable = [];
            attacked = [];
        } else if (currentSpell) {
            accessible = [];
            targetable = currentSpell.targetableTiles(
                BOARD.getEntityCoordinate(GAME_MANAGER.currentHero!),
                BOARD,
                visibles
            );
        } else {
            targetable = [];
            attacked = [];
            accessible = getAccessibles(
                BOARD.getEntityCoordinate(GAME_MANAGER.currentHero!),
                GAME_MANAGER.currentHero!.resources[ResourceType.STAMINA]!,
                BOARD,
                visibles
            );
        }

        if (
            active
            && !active.equals(BOARD.getEntityCoordinate(GAME_MANAGER.currentHero!))
            && accessible.some((c: Coordinate) => c.equals(active as Coordinate))
        ) {
            if (!path[path.length - 1]?.isNeighbor(BOARD.getEntityCoordinate(GAME_MANAGER.currentHero!))) {
                path = findPath(BOARD.getEntityCoordinate(GAME_MANAGER.currentHero!), active, BOARD, accessible);
            } else if (path.some((c: Coordinate) => c.equals(active as Coordinate))) {
                // If the path makes a loop, cut it to the active tile
                while (!path[0].equals(active)) {
                    path.shift();
                }
            } else if (path.length > 0
                && active.neighbors.some((n => n.equals(path[0])))
                && BOARD.getPathCost(path) + BOARD.getTile(active).movementCost! <= GAME_MANAGER.currentHero!.resources[ResourceType.STAMINA]
            ) {
                // If the active tile is simply a neighbor of the first tile of the path, add it to the path
                path = [active, ...path];
            } else {
                // Otherwise, find the new shortest path
                path = findPath(BOARD.getEntityCoordinate(GAME_MANAGER.currentHero!), active, BOARD, accessible);
            }
            movementCost.set(BOARD.getPathCost(path));

            display.set(path.length > 0);
        } else if (active && targetable.some((c: Coordinate) => c.equals(active as Coordinate))) {
            path = [];
            attacked = currentSpell?.attackedTiles(BOARD.getEntityCoordinate(GAME_MANAGER.currentHero!), active, BOARD) || [];
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
        currentSpell = undefined;
        GAME_MANAGER.nextTurn();
    }

    function hover(x: number, y: number) {
        lastHover = new Coordinate({x, y});
        clearHover();
        if (BOARD.getTile({x, y}).type !== TileType.Wall && (
            accessible.some((c: Coordinate) => c.equals(new Coordinate({x, y})))
            || targetable.some((c: Coordinate) => c.equals(new Coordinate({x, y}))))) {
            active = new Coordinate({x, y});
        }
    }

    function clearHover() {
        active = undefined;
    }

    function onAction(x: number, y: number) {
        if (!active) {
            return;
        } else if (currentSpell) {
            GAME_MANAGER.castSpell(currentSpell, new Coordinate({x, y}));
            currentSpell = undefined;
        } else {
            GAME_MANAGER.moveEntity(GAME_MANAGER.currentHero!, path);
        }
    }

    async function mark(x: number, y: number) {
        const coordinate: Coordinate = new Coordinate({x, y});
        markers = [...markers, coordinate]
        await delay(5000)
        markers = markers.filter((c: Coordinate) => !c.equals(coordinate));
    }

    function previewSpell(spell: Spell) {
        if (currentSpell === spell // if already previewing the spell, cancel it
            || !(GAME_MANAGER.currentHero! as HeroEntity).spells!.includes(spell) // If the hero doesn't have the spell, cancel it
            || !GAME_MANAGER.currentHero!.has(spell.cost)) { // if the hero doesn't have enough resources, cancel it
            currentSpell = undefined;
        } else {
            active = lastHover;
            currentSpell = spell;
        }
    }

    onMount(async () => {
        const TEAM_1 = new Team(Color.RED, "Team 1");
        const TEAM_2 = new Team(Color.BLUE, "Team 2");

        GAME_MANAGER.pushTeam(TEAM_1);
        GAME_MANAGER.pushTeam(TEAM_2);

        const HERO_1 = new HeroEntity(await getCompleteHero("armony"));
        const HERO_2 = new HeroEntity(await getCompleteHero("outrage"));
        const HERO_3 = new HeroEntity(await getCompleteHero("armony"));

        HERO_1.team = TEAM_1;
        HERO_2.team = TEAM_2;
        HERO_3.team = TEAM_2;

        GAME_MANAGER.pushEntity(HERO_1, new Coordinate({x: 0, y: 0}));
        GAME_MANAGER.pushEntity(HERO_2, new Coordinate({x: 1, y: 0}));
        // GAME_MANAGER.pushEntity(HERO_3, new Coordinate({x: 13, y: 12}));
    });
</script>

<KeyBoardListener on:space={nextTurn}
                  on:digit={(event)=>previewSpell(GAME_MANAGER.currentHero.spells[event.detail.digit-1])}
/>


<!--TODO : Better title management-->
<svelte:head>
    <title>
        {$GAME_MANAGER_STORE.currentHero?.name}'s turn !
    </title>
</svelte:head>

<svelte:document
        style:backdrop-filter="blur(10px)"
/>


<section in:fly={{delay: 200}} out:fly={{duration: 200}}>
    <board>
        <BoardComponent
                {...{
                    board: $GAME_MANAGER_STORE.board,
                    path,
                    active,
                    accessible,
                    visibles,
                    markers,
                    targetable,
                    attacked
                }}
                on:click={(event)=>onAction(event.detail.x,event.detail.y)}
                on:rightclick={(event)=>{mark(event.detail.x,event.detail.y)}}
                on:hovertile={(event)=>hover(event.detail.x,event.detail.y)}
                on:exit={()=>{clearHover();lastHover = undefined;}}
                on:mouseenterentity={(event)=>{targetEntity = event.detail;}}
                on:mouseleaveentity={()=>{targetEntity = undefined;}}
        />
    </board>


    <heroResume>
        <HeroResume hero={targetEntity} stickRight/>
    </heroResume>
    <spellResume>
        <SpellResume spell={currentSpell}/>
    </spellResume>

    <bottom>
        {#if $GAME_MANAGER_STORE.currentHero}
            <ActionBar
                    hero={$GAME_MANAGER_STORE.currentHero}
                    spellPreview={currentSpell}
                    on:spellaction={(event)=>{
                    previewSpell(event.detail.spell)
                }}
                    on:endturn={()=>nextTurn()}/>
            <!--            <TimerProgressBar percentage={gameManager.gameTimer.percentage}/>-->
            <TimerProgressBar percentage={50}/>
        {/if}
    </bottom>
</section>

<style>
    section {
        height: 100vh;
        display: block;
        background: linear-gradient(180deg, transparent 0%, var(--color-theme) 100%);
        backdrop-filter: blur(.5em);
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