<script lang="ts">
    import {createEventDispatcher} from 'svelte';
    import {movementCostIndicator} from "../indicators/movementcostindicator/";
    import {Coordinate, TileType, Board} from "../../board/";
    import UIBoard from "./UIBoard";
    import HeroComponent from "./HeroComponent.svelte";

    const dispatch = createEventDispatcher();

    export let board: UIBoard;
    export let visibles: Coordinate[] = [];
    export let accessible: Coordinate[] = [];
    export let assailable: Coordinate[] = [];
    export let path: Coordinate[] = [];
    export let active: Coordinate | undefined = undefined;

    let heroMap = board.map
    let targetHero = board.targetHero

</script>

<table on:mouseleave={()=> dispatch('exit')}
       style:--width={board.width + "em"}>
    {#each {length: board.height} as _, y}
        <tr>
            {#each {length: board.width} as _, x}
                <td class:path={path.some((c) => c.is(x, y))}
                    class:fog={!visibles.some((c) => c.is(x, y))}
                    class:wall={board.getTile(x,y).type === TileType.Wall}
                    class:accessible={accessible.some((c) => c.is(x, y))}
                    class:assailable={assailable.some((c) => c.is(x, y))}
                    class:active={$targetHero?.tile.is(x,y) || active?.is(x,y)}
                    on:click={()=>dispatch('click', {x, y})}
                    on:mouseenter={()=>dispatch('hovertile', {x, y})}
                    on:contextmenu|preventDefault={()=>dispatch('rightclick', {x, y})}
                    use:movementCostIndicator>
                    {#if $heroMap[y][x]}
                        <HeroComponent
                                targetHero={targetHero}
                                hero={$heroMap[y][x]}/>
                    {/if}
                </td>
            {/each}
        </tr>
    {/each}
</table>


<style>

    table {
        --color: var(--color-blue);
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
        --base-color: color-mix(in srgb, var(--color), white 95%);
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

    td.accessible, td.fog, td.assailable {
        --percent: 50%;
    }

    td.fog {
        --mix-color: color-mix(in srgb, var(--color), black 80%);
    }

    td.accessible {
        --mix-color: #20d070;
    }

    td.path {
        --percent: 80%;
        --mix-color: #00a020;
    }


    td.assailable {
        --mix-color: #e92;
    }

    td.wall {
        background-color: transparent;
    }

    td.active {
        --outline-color: white;
        --percent: 100%;
        outline: 0.2em solid var(--outline-color);
        border-radius: 0.1em;
        transform: rotate(5deg) scale(1.5);
        cursor: pointer;

        position: relative;
        z-index: 1;
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