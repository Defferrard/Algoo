<script lang="ts">
    import {navigating} from "$app/stores";
    import { fly } from 'svelte/transition';
    import {count} from "./";
</script>

{#if $navigating || $count !== 0}
    <loadingPage transition:fly>
        Loading...
    </loadingPage>
{/if}

<style>
    loadingPage {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1000;
        color: white;
        font-size: 10em;
        background: color-mix(in srgb, var(--color-body), transparent 5%);
        display: flex;
        justify-content: center;
        align-items: center;
        user-select: none;
    }
</style>