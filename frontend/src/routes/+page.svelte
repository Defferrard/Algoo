<script lang="ts">
  import { goto } from '$app/navigation';
  import { loadingMutex } from '$lib/components';
  import { Window } from '$lib/components/layout/';
  import StandardLayout from '$lib/components/layout/StandardLayout.svelte';
  import { GAME_ROOM_REPOSITORY } from '$lib/repositories';
  import { onDestroy, onMount } from 'svelte';
  import type { Unsubscriber } from 'svelte/store';

  const [GAMES_DATA, GAMES_LOADING, GAMES_ERROR, GAMES_REFRESH] = GAME_ROOM_REPOSITORY.store.getAll();
  const loadingMutexGamesLoadingUnsubscribe: Unsubscriber = loadingMutex.boundStore(GAMES_LOADING);

  function createGameRoom() {
    GAME_ROOM_REPOSITORY.request.create('test').then((res) => {
      res.json().then((data) => {
        goto(`/gamerooms/${data.uuid}`);
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
    <container>
      <Window animated={false}>
        <div slot="header">Game Rooms</div>
        <button-bar>
          <button on:click={GAMES_REFRESH} class="material-symbols-rounded icon-button"> Refresh </button>
          <button on:click={createGameRoom} class="text-button"> Create Game... </button>
        </button-bar>
        <hr />
        <div>
          <gamerooms>
            {#each $GAMES_DATA || [] as gameRoom}
              <button on:click={() => goto(`/gamerooms/${gameRoom.uuid}`)}>
                <div>
                  {#if Object.keys(gameRoom.players).length > 0}
                    {Object.values(gameRoom.players)[0].user.name}'s Game Room
                  {:else}
                    Empty Game Room
                  {/if}
                </div>
                <div>
                  ({Object.keys(gameRoom.players).length}/{gameRoom.maxPlayers})
                </div>
              </button>
            {/each}
          </gamerooms>
        </div>
        <a href="/game">Test Game here...</a>
      </Window>
    </container>
  </center-flex>
</StandardLayout>

<style>
  center-flex {
    --width: 30em;

    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 100%;
    gap: 1em;

    margin: 0 1em;
  }

  @media (max-width: 600px) {
    center-flex {
      --width: 90vw;
      font-size: 3vw;
    }
  }

  hr {
    border: solid 0.1em;
    color: var(--color-body-5);
  }

  button-bar {
    display: flex;
    align-items: flex-start;
    z-index: 1;
  }

  gamerooms {
    flex-direction: column;
    display: block;
    overflow: auto;
    height: 70vh;
  }

  container {
    width: var(--width);
  }

  .text-button,
  .icon-button {
    font-size: 1em;
    background-color: transparent;
    color: var(--color);
    text-decoration: underline;
    text-decoration-color: transparent;
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

  .text-button:hover,
  .text-button:active {
    text-decoration-color: var(--color);
  }

  gamerooms > button {
    background: none;
    width: 100%;
    font-size: 1em;
    color: var(--color-body);
    display: flex;
    justify-content: space-between;

    text-decoration: underline;
    text-decoration-color: transparent;
  }

  gamerooms > button:nth-child(even) {
    background-color: var(--color-body-5);
  }

  gamerooms > button:hover {
    text-decoration-color: unset;
  }
</style>
