<script lang="ts">
    import {createEventDispatcher} from 'svelte';
    import type {Readable} from "svelte/store";
    import {HeroEntity, Spell} from "../../game";
    import HeroResume from "./HeroResume.svelte";
    import {getCSS, Color} from "$lib/components/Color";
    import SpellIcon from "$lib/components/game/SpellIcon.svelte";

    const dispatch = createEventDispatcher();

    export let hero: Readable<HeroEntity | undefined>;
    export let spellPreview: Readable<Spell | undefined>;

</script>

<bar>
    <resume>
        <HeroResume {...{hero, spellPreview}}/>
    </resume>
    {#each $hero.spells as spell}
        <button class="spell"
                disabled={!$hero.has(spell.cost)}
                on:click={(event)=> {
                    dispatch('spellaction', {spell});
                    event.stopPropagation();
                }}
                on:mouseenter={()=>dispatch('mouseenterspell', {})}
                on:mouseleave={()=> dispatch('mouseleavespell', {})}>
            <SpellIcon {spell} />
        </button>
    {/each}
    <button class="end_turn"
            on:click={()=> dispatch('endturn')}>
        End Turn
    </button>
</bar>

<style>
    bar {
        filter: drop-shadow(0 0 1em black);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    resume {
        z-index: 1;
        margin-right: 2em;
        width: 20vw;
    }


    button.spell {
        --translate: 0.3em;
        background: none;
        border: none;
        margin: 0.2em;
        padding: 0;
        font-size: 2vh;
    }

    button.end_turn {
        --translate: 0.2em;
        color: var(--color-lighter);
        background-color: var(--color);
        padding: 0.5em 1em;
        margin: 0 1em;
        border-radius: 0.5em;
        border: none;
        font-size: 3vh;
        font-weight: bold;
    }

    button.end_turn:hover:enabled, button.spell:hover:enabled {
        box-shadow: var(--translate) var(--translate) 1em 0.1em black;
        transform: translate(calc(0em - var(--translate)), calc(0em - var(--translate))) scale(1.4) rotate(5deg);
    }

    button.end_turn:active:enabled, button.spell:active:enabled {
        transform: unset;
        box-shadow: unset;
        filter: brightness(75%);
    }

    button:disabled{
        filter: brightness(25%);
    }

</style>