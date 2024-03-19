<script lang="ts">
    import {goto} from '$app/navigation';
    import {GAME_ROOM_REPOSITORY} from "$lib/repositories";
    import {onMount} from "svelte";

    const URL = "defferrard.dev";

    const [GAMES_DATA, GAMES_LOADING, GAMES_ERROR, GAMES_REFRESH] = GAME_ROOM_REPOSITORY.store.getAll();

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
</script>


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

    }

    button-bar {
        display: flex;
        align-items: flex-start;
        width: var(--width);
        gap: 2em;
    }

    content {
        transition: 0.2s;
        background-color: rgb(var(--color-main-rgb), 0.7);
        border-radius: 0.5em;
        width: var(--width);
        height: 80vh;
        overflow-x: hidden;
        overflow-y: auto;

        outline: 0.2em solid var(--color-main);
        outline-offset: 0.2em;
    }

    content::-webkit-scrollbar-thumb {
        border-radius: 0 1em 1em 0;
    }

    content::-webkit-scrollbar-track {
        border-radius: 0 1em 1em 0;
        background-color: color-mix(in srgb, var(--color-main), black var(--color-gaper));
    }

    .text-button, .icon-button {
        background-color: rgb(var(--color-main-rgb), 0.7);
        color: var(--color-lighter);
        border: none;
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

    .icon-button:hover, .text-button:hover {
        background-color: rgb(var(--color-main-rgb), 1);
        transform: translateY(-0.1em);
    }

    .icon-button:active, .text-button:active {
        background-color: rgb(var(--color-main-rgb), 0.5);
        transform: translateY(0.1em);
    }

    .icon-button:hover {
        transform: rotate(180deg);
    }

    .icon-button:active {
        transform: rotate(360deg);
    }

    content > button{
        background:none;
        width: 100%;
        border: none;
        font-size: 1.5em;
        color: var(--color-lighter);
    }

    content > button:hover{
        background-color: rgb(var(--color-main-rgb), 1);
        box-shadow: 0 0 0.5em 0 black;
        transform: translateY(-0.1em);

    }

    content > button:active{
        filter: brightness(0.5);
        transform: translateY(0.1em);
    }
</style>