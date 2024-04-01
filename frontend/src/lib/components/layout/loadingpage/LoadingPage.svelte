<script lang="ts">
    import {navigating} from "$app/stores";
    import {fly} from 'svelte/transition';
    import {loadingMutex} from "./";
    import {onMount} from "svelte";
    loadingMutex.increment();

    onMount(() => {
        loadingMutex.decrement();
    });
</script>

{#if $navigating || $loadingMutex > 0}
    <loadingPage transition:fly>
        <icon class="material-symbols-rounded">
            sync
        </icon>
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
        background: black;
        opacity: 95%;
        display: flex;
        justify-content: center;
        align-items: center;
        user-select: none;
    }

    icon{
        opacity: 20%;
        animation: spin 5s linear infinite;
        font-size: 10em;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(-360deg); }
    }
</style>