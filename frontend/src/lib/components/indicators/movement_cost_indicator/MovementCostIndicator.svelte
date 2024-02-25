<script lang="ts">
    import {fly} from 'svelte/transition';
    import type {Tweened} from "svelte/motion";
    import {tweened} from "svelte/motion";

    import {movementCost, display} from "./index";

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
    <indicator transition:fly
             style="
		top: {y + 5}px;
		left: {x + 5}px;">
        <content>
            {Math.ceil($value)}
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
        left: calc(-50% - 0.2em);
        top: -1em;
        -webkit-text-stroke-width: 0.07em;
        -webkit-text-stroke-color: var(--color-body);
        color: var(--color-lighter);
        font-weight: bold;
        text-shadow: 0 0 0.2em var(--color-body);
        animation: float 2s ease-in-out infinite;
    }

    @keyframes float {
        0% {
            transform: translatey(0.1em);
        }
        50% {
            transform: translatey(-0.1em);
        }
        100% {
            transform: translatey(0.1em);
        }
    }
</style>