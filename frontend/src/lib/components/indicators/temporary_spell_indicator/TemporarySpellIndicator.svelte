<script lang="ts">
    import {fly} from 'svelte/transition';
    import {onMount} from "svelte";

    import {Spell} from "@defferrard/algoo-core/src/game";

    import SpellIcon from "$lib/components/game/SpellIcon.svelte";

    export let x: number;
    export let y: number;
    export let spell: Spell;

    export let duration: number;

    export let visible = false;
    onMount(() => {
        visible = true;
    });
</script>

{#if visible}
    <indicator in:fly={{y:10, duration:duration}}
               out:fly={{y:-10, x:Math.random()*100-50, duration:duration}}
               style="
		top: {y}px;
		left: {x}px;">
        <content>
            <SpellIcon {spell} size={1.5}/>
        </content>
    </indicator>
{/if}

<style>
    indicator {
        z-index: 14;
        pointer-events: none;
        position: absolute;
        font-size: 2em;
    }

    content {
        position: relative;
        left: -0.25em;
        top: -2em;
        color: var(--color);
    }
</style>