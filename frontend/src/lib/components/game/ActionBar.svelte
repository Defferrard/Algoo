<script lang="ts">
    import {createEventDispatcher} from 'svelte';
    import HeroResume from "./HeroResume.svelte";
    import SpellIcon from "$lib/components/game/SpellIcon.svelte";

    import {HeroEntity, Spell} from "@defferrard/algoo-core/src/game";


    const dispatch = createEventDispatcher();

    export let hero: HeroEntity;
    export let spellPreview: Spell;

</script>

<bar>
    <resume>
        <HeroResume {...{hero, spellPreview}}/>
    </resume>
    {#each hero.spells as spell}
        <button class="spell"
                disabled={!hero.has(spell.cost)}
                on:click={(event)=> {
                    dispatch('spellaction', {spell});
                    event.stopPropagation();
                }}
                on:mouseenter={()=>dispatch('mouseenterspell', {})}
                on:mouseleave={()=> dispatch('mouseleavespell', {})}>
            <SpellIcon {spell}/>
        </button>
    {/each}
    <button class="end_turn material-symbols-rounded"
            on:click={()=> dispatch('endturn')}>
        play_arrow
    </button>
</bar>

<style>
    bar {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    resume {
        z-index: 1;
        margin-right: 1em;
        width: 20vw;
    }


    button.spell {
        --translate: 0.3em;
        background: none;
        outline: outset white .3em;
        outline-offset: -.3em;

        border-radius: 1em;
        overflow: hidden;
        margin: 0.2em;
        padding: 0;
        font-size: 2vh;
        transform: rotate(15deg);
        z-index: 0;

        min-height: 5em;
        min-width: 5em;

        box-shadow: 0 0 1px 1px black;
    }

    button.end_turn {
        --translate: 0.2em;
        color: var(--color);
        background-color: transparent;
        border: outset .4em var(--color);
        padding: .5em;
        margin: 0 1em;
        border-radius: 1em;
        font-size: 3vh;
        font-weight: bold;

        min-height: 3em;
        min-width: 3em;

        transform: rotate(15deg);

        box-shadow: 0 0 1px 1px black;
    }

    button.end_turn:hover:enabled {
        color: white;
        background-color: var(--color);
        border: solid 0.2em var(--color);
    }

    button.end_turn:hover:enabled, button.spell:hover:enabled {
        transform: translate(calc(0em - var(--translate)), calc(0em - var(--translate))) scale(1.4) rotate(0deg);
        z-index: 1;
        padding: 0;
    }

    button.end_turn:active:enabled, button.spell:active:enabled {
        transform: scale(0.8) rotate(15deg);
        filter: brightness(75%);
    }

    button:disabled {
        filter: brightness(25%) drop-shadow(0 0 1px black);
    }

</style>