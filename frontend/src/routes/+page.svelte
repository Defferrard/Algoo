<script lang="ts">
    import {goto} from '$app/navigation';
    import {GAME_ROOM_REPOSITORY} from "$lib/repositories";
    import {onDestroy, onMount} from "svelte";
    import StandardLayout from "$lib/components/layout/StandardLayout.svelte";
    import {loadingMutex} from "$lib/components";
    import type {Unsubscriber} from "svelte/store";

    const URL = "defferrard.dev";

    const [GAMES_DATA, GAMES_LOADING, GAMES_ERROR, GAMES_REFRESH] = GAME_ROOM_REPOSITORY.store.getAll();
    const loadingMutexGamesLoadingUnsubscribe: Unsubscriber = loadingMutex.boundStore(GAMES_LOADING);

    function createGameRoom() {
        GAME_ROOM_REPOSITORY.request.create("test").then((res) => {
            res.json().then((data) => {
                goto(`/gamerooms/${data.uuid}`)
            });
        });
    }

    onMount(() => {
        GAMES_REFRESH();
    });

    onDestroy(() => {
        loadingMutexGamesLoadingUnsubscribe();
    });
</script>

<StandardLayout>
    <center-flex>
        <button-bar>
            <button on:click={GAMES_REFRESH} class="material-symbols-rounded icon-button">
                Refresh
            </button>
            <button on:click={createGameRoom} class="text-button">
                Create Game
            </button>
        </button-bar>

        <content>
            {#each $GAMES_DATA || [] as gameRoom}
                <button on:click={()=>goto(`/gamerooms/${gameRoom.uuid}`)}>
                    {gameRoom.uuid}
                </button>
            {/each}
        </content>
    </center-flex>
</StandardLayout>

<style>
    center-flex {
        --width: 30em;

        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        height: 100vh;
        gap: 1em;
        filter: drop-shadow(0 0 0.2em black);

        margin: 0 1em;
    }

    @media (max-width: 600px) {
        center-flex {
            --width: 90vw;
            font-size: 3vw;
        }
    }

    button-bar {
        display: flex;
        align-items: flex-start;
        gap: 2em;
    }

    content {
        transition: 0.2s;
        background-color: rgb(var(--color-rgb), 0.7);
        border-radius: 0.5em;
        width: var(--width);

        height: 80vh;
        overflow-x: hidden;
        overflow-y: auto;

        outline: 0.2em solid var(--color);
        outline-offset: 0.2em;
    }

    content::-webkit-scrollbar-thumb {
        border-radius: 0 1em 1em 0;
    }

    content::-webkit-scrollbar-track {
        border-radius: 0 1em 1em 0;
        background-color: color-mix(in srgb, var(--color), black var(--color-gaper));
    }

    .text-button, .icon-button {
        font-size: 1.75em;
    }

    .icon-button {
        padding: 0.5em;
        border-radius: 100%;
    }

    .text-button {
        padding: 0.5em 1em;
        border-radius: 0.5em;
    }

    .icon-button:hover {
        transform: rotate(180deg);
    }

    .icon-button:active {
        transform: rotate(360deg);
    }

    content > button {
        background: none;
        width: 100%;
        font-size: 1.5em;
    }

    content > button:hover {
        background-color: rgb(var(--color-rgb), 1);
        box-shadow: 0 0 0.5em 0 black;

    }

    content > button:active {
        box-shadow: none;
        background: none;
    }
</style>