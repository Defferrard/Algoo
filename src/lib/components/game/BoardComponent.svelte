<script lang="ts">
    import {createEventDispatcher} from 'svelte';
    import {movementCostIndicator} from "../indicators/movementcostindicator/";
    import {Coordinate, TileType, Board} from "../../board/";
    import HeroComponent from "./HeroComponent.svelte";
    import {HeroEntity, GameManager} from "../../game";
    import type {Observer} from "../../utils/Observer";
    import {shakeable} from "../../animations/shake";

    const dispatch = createEventDispatcher();

    export let gameManager: GameManager;
    export let visibles: Coordinate[] = [];
    export let attacked: Coordinate[] = [];
    export let markers: Coordinate[] = [];
    export let accessible: Coordinate[] = [];
    export let targetable: Coordinate[] = [];
    export let path: Coordinate[] = [];
    export let active: Coordinate | undefined = undefined;

    export let targetHero: Observer<HeroEntity | undefined>;

    let entityMap = gameManager.entityMap;
    let board: Board = gameManager.board;

</script>

<table use:shakeable
        on:mouseleave={()=> dispatch('exit')}
       style:--width={board.width + "em"}>
    {#each {length: board.height} as _, y}
        <tr>
            {#each {length: board.width} as _, x}
                <td id={board.getTile(x,y).stringId}
                    class:path={path.some((c) => c.is(x, y))}
                    class:fog={!visibles.some((c) => c.is(x, y))}
                    class:wall={board.getTile(x,y).type === TileType.Wall}
                    class:accessible={accessible.some((c) => c.is(x, y))}
                    class:targetable={targetable.some((c) => c.is(x, y))}
                    class:attacked={attacked.some((c) => c.is(x, y))}
                    class:active={active?.is(x,y)}
                    class:marker={markers.some((c) => c.is(x, y))}
                    on:click={(event)=>{
                        if(board.getTile(x,y).type === TileType.Wall){
                            return;
                        }
                        else if(active?.is(x,y)){
                            event.stopPropagation();
                        }
                        dispatch('click', {x, y});
                    }}
                    on:mouseenter={()=>dispatch('hovertile', {x, y})}
                    on:contextmenu|preventDefault={()=>dispatch('rightclick', {x, y})}
                    use:movementCostIndicator>
                    {#if visibles.some((c) => c.is(x, y)) && $entityMap[y][x]}
                        <HeroComponent
                                {targetHero}
                                hero={$entityMap[y][x]}/>
                    {/if}
                </td>
            {/each}
        </tr>
    {/each}
</table>


<style>

    table {
        --color-table-shadow: color-mix(in srgb, var(--color), black 90%);
        --width: 0;
        --border-radius: 0.2em;
        border-collapse: collapse;
        filter: drop-shadow(0 0 1em var(--color-table-shadow));
        table-layout: fixed;
        width: var(--width);
        font-size: 4vh;
    }

    tr:nth-of-type(even) td:nth-of-type(even),
    tr:nth-of-type(odd) td:nth-of-type(odd) {
        --base-color: color-mix(in srgb, var(--color), white 80%);
    }

    td {
        --base-color: color-mix(in srgb, var(--color), white 90%);
        --mix-color: #fff;
        --percent: 0%;
        padding: 0;
        height: 1em;
        width: 1em;
        text-align: center;
        background-color: color-mix(in srgb, var(--base-color), var(--mix-color) var(--percent));

        outline: 0.2em solid transparent;
        outline-offset: -1px;
        overflow: visible;
    }

    td.accessible, td.targetable, td.attacked {
        --percent: 50%;
    }

    td.fog {
        filter: brightness(0.5);
    }

    td.accessible {
        --mix-color: var(--color-green);
    }

    td.path {
        --percent: 80%;
    }


    td.targetable {
        --mix-color: var(--color-orange);
    }

    td.attacked {
        --mix-color: var(--color-red);
    }

    td.wall {
        background-color: transparent;
    }

    td.active {
        --outline-color: white;
        --percent: 100%;
        outline: 0.2em solid var(--outline-color);
        border-radius: 0.1em;
        transform: rotate(5deg) scale(1.2);
        cursor: pointer;

        position: relative;
        z-index: 1;
        transition-delay: 0.1s;
    }

    td.marker {
        animation-name: markerBlinking;
        animation-duration: 1s;
        animation-iteration-count: infinite;
    }

    @keyframes markerBlinking {
        0% {
            box-shadow: inset 0 0 0.6em 0.1em var(--color);
            filter: brightness(0.8);
        }
        50% {
            box-shadow: inset 0 0 0.4em 0 var(--color);
            filter: brightness(1.2);
        }
        100% {
            box-shadow: inset 0 0 0.6em 0.1em var(--color);
            filter: brightness(0.8);
        }
    }

    /* td of the coin top left */
    tr:first-child > td:first-child {
        border-top-left-radius: var(--border-radius);
    }

    /* td of the coin top right */
    tr:first-child > td:last-child {
        border-top-right-radius: var(--border-radius);
    }

    /* td of the coin bottom left */
    tr:last-child > td:first-child {
        border-bottom-left-radius: var(--border-radius);
    }

    /* td of the coin bottom right */
    tr:last-child > td:last-child {
        border-bottom-right-radius: var(--border-radius);
    }
</style>