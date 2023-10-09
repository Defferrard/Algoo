<script lang="ts">
    import {receive, send} from "../../animations/translate";
    import {HeroEntity} from "../../game";
    import type {Writable} from "svelte/store";
    import {getCSS} from "../Color";

    export let targetHero: Writable<HeroEntity | undefined>;
    export let hero: HeroEntity;
    let uuid = hero.uuid;
    $: if (hero) {
        uuid = hero.uuid;
    }
</script>

<!-- ARIA Role : IMG -->
<hero
        role="img"
        on:mouseenter={()=>targetHero.set(hero)}
        on:mouseleave={()=>targetHero.set(undefined)}
        style:--team-color={getCSS(hero.team.color)}>
    <div in:receive="{{key: hero.uuid}}"
         out:send="{{key: hero.uuid}}">
    </div>
</hero>

<style>
    hero {
        --team-color: black;
        overflow: visible;
        height: 100%;
        width: 100%;
        filter: drop-shadow(0 0 0.5em var(--team-color));
    }

    div {
        border-radius: 10%;
        background-color: var(--team-color);
        width: 0.7em;
        height: 0.7em;
        position: absolute;
        top: calc(50% - 0.35em);
        left: calc(50% - 0.35em);
    }
</style>