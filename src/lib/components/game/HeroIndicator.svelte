<script lang="ts">
    import {fly} from "svelte/transition";
    import {Hero} from "$lib/game/";
    import type {Readable} from "svelte/store";
    import {getCSS} from "../Color";

    export let hero: Readable<Hero | undefined>;
</script>

{#if $hero}
    <indicator
            transition:fly={{x:200}}
            style:--color={getCSS($hero.team.color)}>
        <icon>
            <div style:background-color="var(--color)" style:height="100%" style:width="100%">
            </div>
        </icon>
        <info>
            <name>
                {$hero.name}
            </name>
            <title>
                {$hero.title}
            </title>
            <healthbar style:--max-percent={$hero.maxHealth*5+'%'}
                       style:--percent={$hero.health*100/$hero.maxHealth +'%'}>
                <value>{$hero.health} / {$hero.maxHealth} HP</value>
                <bar></bar>
            </healthbar>
            <staminabar style:--max-percent={$hero.maxStamina*5+'%'}
                        style:--percent={$hero.stamina*100/$hero.maxStamina +'%'}>
                <value>{$hero.stamina} / {$hero.maxStamina} SP</value>
                <bar></bar>
            </staminabar>
        </info>
    </indicator>
{/if}

<style>
    indicator {
        --color: black;
        --color-indicator-shadow: color-mix(in srgb, var(--color), black 70%);
        filter: drop-shadow(0 0 1em var(--color-indicator-shadow));

        font-size: 3vh;
        color: white;
        position: absolute;
        display: flex;
        flex-direction: row-reverse;
        top: 10vh;
        right: 2vw;
    }

    icon {
        --outline-color: white;
        height: 20vh;
        width: 20vh;
        display: flex;
        justify-content: center;
        align-items: center;
        transform: rotate(15deg);
        background-color: var(--outline-color);
        outline: 0.5em solid var(--outline-color);
        outline-offset: -2px;
        border-radius: 0.2em;
        z-index: 1;
    }

    info {
        transform: skew(-15deg);
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 0.2em;
    }

    name, title {
        overflow: hidden;
        background-color: black;
        display: block;
        padding: 0 15% 0 10%;

        /* Fit in 1 line */
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }

    name {
        font-size: 1.5em;
    }

    healthbar, staminabar {
        --max-percent: 0%;
        --percent: 0%;
        --display: '';
        font-size: 0.7em;
        width: calc(var(--max-percent) + 5em);
        background-color: color-mix(in srgb, var(--color), transparent 50%);
    }

    bar {
        float: right;
        width: var(--percent);
        background-color: var(--color);
        border-left: solid 0.5em;
    }

    healthbar {
        --color: var(--color-red);
    }

    staminabar {
        --color: var(--color-yellow);
    }

    healthbar:after, staminabar:after, bar:after, bar {
        content: ' ';
        display: inline-block;
    }

    value {
        white-space: nowrap;
        position: absolute;
        padding-left: 1em;
        text-shadow: 0 0 0.5em black;
    }
</style>