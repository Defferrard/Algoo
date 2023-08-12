<script lang="ts">
    import {fly} from 'svelte/transition';
    import {onMount} from "svelte";

    export let x: number;
    export let y: number;
    export let value: number;

    export let duration: number;

    export let visible = false;
    onMount(() => {
        visible = true;
    });
</script>


{#if visible}
    <indicator in:fly={{y:10}}
               out:fly={{y:-10}}
               style="
		top: {y + 5}px;
		left: {x + 5}px;">
        <content>
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
        font-family: Roboto, sans-serif;
        position: relative;
        left: calc(-50% - 0.2em);
        top: -2.5em;
        -webkit-text-stroke-width: 0.07em;
        -webkit-text-stroke-color: var(--color-body);
        color: var(--color-lighter);
        font-weight: bold;
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