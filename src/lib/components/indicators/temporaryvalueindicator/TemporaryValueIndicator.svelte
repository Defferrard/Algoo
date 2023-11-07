<script lang="ts">
    import {fly} from 'svelte/transition';
    import {onMount} from "svelte";
    import {Color, getCSS} from "../../../components/Color";

    export let x: number;
    export let y: number;
    export let value: number;

    export let duration: number;

    export let color: Color;

    export let visible = false;
    onMount(() => {
        visible = true;
    });
</script>

{#if visible}
    <indicator in:fly={{y:10}}
               out:fly={{y:-10}}
               style:--color={getCSS(color)}
               style="
		top: {y}px;
		left: {x}px;">
        <content>
            {#if value>0}
                +
            {/if}
            {value}
        </content>
    </indicator>
{/if}

<style>
    indicator {
        pointer-events: none;
        position: absolute;
        font-size: 2em;
    }

    content {
        display: block;
        font-family: poppins, sans-serif;
        position: relative;
        top: -1em;
        -webkit-text-stroke-width: 2px;
        -webkit-text-stroke-color: color-mix(in srgb, var(--color), black 70%);
        color: var(--color);
        font-weight: bolder;
        animation: float 1s ease-in-out infinite;
    }

    @keyframes float {
        0% {
            transform: translatey(0);
        }
        50% {
            transform: translatey(-0.2em);
        }
        100% {
            transform: translatey(0);
        }
    }
</style>