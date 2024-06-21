<script lang="ts">
  import { page } from '$app/stores';
  import { Window } from '$lib/components/layout/';
  import { fly } from 'svelte/transition';
  import Chatbox from './Chatbox.svelte';
  import QRCode from './QRCode.svelte';
  import type { GameRoomModel } from './GameRoomModel';
  import type { GameRoomViewController } from './GameRoomViewController';

  export let model: GameRoomModel;
  export let controller: GameRoomViewController;
</script>

<section in:fly={{ delay: 200 }} out:fly={{ duration: 200 }}>
  <chatbox>
    <Chatbox
      room={model.gameRoom.uuid}
      messages={$model.messages}
      on:send={(e) => controller.pushMessage(e.detail.message)}
    />
  </chatbox>

  <informations>
    <Window animated={false}>
      <div slot="header">Game Room</div>
      <subsection>
        <qrcode>
          <QRCode value={$page.url.toString()} />
        </qrcode>
        <players>
          <b>Players ({Object.keys($model.gameRoom.players).length}/2) </b>
          {#each Object.values($model.gameRoom.players) as player}
            <player>
              <icon class="material-symbols-rounded" class:ready={player.isReady}>
                {#if player.isReady}
                  task_alt
                {:else}
                  progress_activity
                {/if}
              </icon>
              <name>{player.user.name}</name>
            </player>
          {/each}
          {#if Object.keys($model.gameRoom.players).length === 2}
            <br />
            <button on:click={controller.flipReady}>I'm ready !</button>
          {/if}
        </players>
      </subsection>
    </Window>
  </informations>
</section>

<style>
  chatbox {
    align-self: stretch;
    flex: 1 1 100%;
  }

  section {
    padding: 5em 5vw;

    display: flex;
    justify-content: center;
    align-items: center;

    gap: 3em;

    height: calc(100% - 10em);
  }

  subsection {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1em;

    padding: 1em 0;
  }

  players {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.2em;
  }

  player {
    display: flex;
    width: 100%;
    align-items: center;
    gap: 0.5em;
  }

  player > icon {
    opacity: 0.3;
    transform: rotate(0deg);
  }

  player > icon.ready {
    color: var(--color);
    opacity: 1;
    animation: rotate 1s infinite;
    transform: rotate(360deg);
  }

  @media (max-width: 800px) {
    section {
      flex-direction: column-reverse;
      gap: 1em;
      padding: 2em 1em 2em 1em;
      align-self: stretch;
      height: calc(100% - 4em);
    }

    chatbox {
      flex: 1 1 auto;
    }

    subsection {
      flex-direction: row-reverse;
      justify-content: flex-start;
      align-self: stretch;
      padding: 0 1em;

      height: auto;
    }

    qrcode {
      font-size: 0.75em;
    }
  }
</style>
