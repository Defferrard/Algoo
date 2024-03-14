<script lang="ts">
    import { goto } from '$app/navigation';
    import {JSON} from "$lib/components/index.js";
    import {GAME_ROOM_REPOSITORY} from "$lib/repositories";
    import {onMount} from "svelte";

    const URL = "defferrard.dev";

    const [GAMES_DATA, GAMES_LOADING, GAMES_ERROR, GAMES_REFRESH] = GAME_ROOM_REPOSITORY.store.getAll();

    function createGameRoom(){
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

<section>
    <button on:click={GAMES_REFRESH}>
        Refresh
    </button>
    <button on:click={createGameRoom}>
        Create Game
    </button>
    <div>
        {#each $GAMES_DATA || [] as gameRoom}
            <button on:click={()=>goto(`/gamerooms/${gameRoom.uuid}`)}>
                {gameRoom.uuid}
            </button>
        {/each}
    </div>
</section>

<style>
    section {
        padding: 5vw;
    }
    div {
        overflow-y: scroll !important;
        height: 50vh;

    }
</style>