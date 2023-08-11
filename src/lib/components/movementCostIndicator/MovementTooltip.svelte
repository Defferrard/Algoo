<script lang="ts">
    import {fly} from 'svelte/transition';
    import {movementCost, display} from "./movementCostIndicator";
    import {tweened} from "svelte/motion";
    import type {Tweened} from "svelte/motion";

    const duration: number = 200;

    const value: Tweened<number> = tweened(0, {
        duration
    });

    movementCost.subscribe((cost: number) => {
        value.set(cost);
    })
    display.subscribe((display: boolean) => {
        if (!display) {
            value.set(0);
        }
    })
    export let x: number;
    export let y: number;

</script>

{#if $display}
    <tooltip transition:fly={{y:10}}
             style="
		top: {y + 5}px;
		left: {x + 5}px;">
        <content>
            {Math.ceil($value)}
        </content>
    </tooltip>
{/if}

<style>
    tooltip {
        pointer-events: none;
        position: absolute;
        font-size: 2em;
    }

    content {
        display: block;
        font-family: Roboto, sans-serif;
        position: relative;
        left: calc(-50% - 0.2em);
        top: -2.5em;
        -webkit-text-stroke-width: 0.07em;
        -webkit-text-stroke-color: var(--color-body);
        color: var(--color-lighter);
        font-weight: bold;
        animation: float 2s ease-in-out infinite;
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