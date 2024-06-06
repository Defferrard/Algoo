<script lang="ts">
  import { StandardLayout } from '$lib/components/layout/index';
  import { authStore } from '$lib/stores/auth';
  import { localUser } from '$lib/stores/localUser';
  import { Player } from '@defferrard/algoo-core/src/game';
  import { GameRoomState } from '@defferrard/algoo-core/src/game/GameRoom.js';
  import type { User } from '@defferrard/algoo-core/src/socket';
  import { onDestroy, onMount } from 'svelte';

  import { GameRoomView } from './GameRoomView';

  import LobbyPage from './LobbyPage.svelte';
  import type { Readable } from 'svelte/store';

  export let data;

  let roomUuid = data.uuid;
  let gameRoomView = new GameRoomView() as unknown as GameRoomView & Readable<GameRoomView>;

  const [jwt, loading, error, login] = authStore();

  $: if ($jwt) {
    gameRoomView.connect(roomUuid, $jwt);
  }

  onMount(async () => {
    let player: Player = new Player($localUser as User);
    await login(player.user.name);
  });

  onDestroy(() => {
    gameRoomView.disconnect();
  });
</script>

<StandardLayout>
  {#if $gameRoomView.gameRoom.state === GameRoomState.LOBBY}
    <LobbyPage
      {roomUuid}
      {...{
        messages: $gameRoomView.messages,
        players: $gameRoomView.gameRoom.players,
      }}
    />
  {:else if $gameRoomView.gameRoom.state === GameRoomState.PLAYING}
    <!--    <GameView {...{ gameManager }} />-->
  {/if}
</StandardLayout>
<float>
  <button
    on:click={() => {
      gameRoomView.gameRoom.state =
        gameRoomView.gameRoom.state === GameRoomState.PLAYING ? GameRoomState.LOBBY : GameRoomState.PLAYING;
    }}
    >Swap
  </button>
</float>

<style>
  float {
    position: fixed;
    bottom: 0;
    left: 0;
    padding: 10px;
    cursor: pointer;
    user-select: none;
  }
</style>
