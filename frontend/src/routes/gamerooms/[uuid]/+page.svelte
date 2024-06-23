<script lang="ts">
  import { StandardLayout } from '$lib/components/layout/index';
  import { authStore } from '$lib/stores/auth';
  import { localUser } from '$lib/stores/localUser';
  import { Player } from '@defferrard/algoo-core/src/game';
  import { GameRoomState } from '@defferrard/algoo-core/src/game/GameRoom';
  import type { User } from '@defferrard/algoo-core/src/socket';
  import { onDestroy, onMount } from 'svelte';

  import LobbyPage from './LobbyView.svelte';
  import { socket } from '$lib/stores/socket';
  import { create as createGameRoomSet } from './GameRoomBuilder';
  import GameView from './GameView.svelte';

  export let data;

  let roomUuid = data.uuid;
  const { model: gameRoomModel, viewController: gameRoomViewController } = createGameRoomSet();
  const [jwt, loading, error, login] = authStore();

  $: if ($jwt) {
    gameRoomModel.register();
    socket.connect(roomUuid, $jwt);
  }

  onMount(async () => {
    let player: Player = new Player($localUser as User);
    await login(player.user.name);
  });

  onDestroy(() => {
    socket.disconnect();
  });
</script>

<StandardLayout>
  {#if $gameRoomModel.gameRoom.state === GameRoomState.LOBBY}
    <LobbyPage model={gameRoomModel} controller={gameRoomViewController} />
  {:else if $gameRoomModel.gameRoom.state === GameRoomState.PLAYING && $gameRoomModel.gameManagerCurrentDTO}
    <GameView gameManagerDTO={$gameRoomModel.gameManagerCurrentDTO} />
  {/if}
</StandardLayout>
