<script lang="ts">
  import { StandardLayout } from '$lib/components/layout/index';
  import { authStore } from '$lib/stores/auth';
  import { localUser } from '$lib/stores/localUser';
  import { Color, Player } from '@defferrard/algoo-core/src/game';
  import { GameRoomState } from '@defferrard/algoo-core/src/game/GameRoom';
  import { onDestroy, onMount } from 'svelte';

  import LobbyPage from './LobbyView.svelte';
  import { socket } from '$lib/stores/socket';
  import { create as createGameRoomSet } from './GameRoomBuilder';
  import GameView from './GameView.svelte';
  import { v4 as uuid } from 'uuid';

  export let data;

  let roomUuid = data.uuid;
  const { model: gameRoomModel, viewModel: gameRoomViewModel } = createGameRoomSet();
  const [jwt, loading, error, login] = authStore();

  $: if ($jwt) {
    gameRoomModel.register();
    socket.connect(roomUuid, $jwt);
  }

  onMount(async () => {
    let player: Player = new Player({
      user: $localUser,
      team: { color: Color.BLUE, uuid: uuid(), heroes: [] },
      isReady: false,
    });
    await login(player.user.name);
  });

  onDestroy(() => {
    socket.disconnect();
  });
</script>

<StandardLayout>
  {#if $gameRoomModel.gameRoom.state === GameRoomState.LOBBY}
    <LobbyPage model={gameRoomModel} viewModel={gameRoomViewModel} />
  {:else if $gameRoomModel.gameRoom.state === GameRoomState.PLAYING && $gameRoomModel.gameManagerCurrentDTO}
    <GameView gameManagerDTO={$gameRoomModel.gameManagerCurrentDTO} />
  {/if}
</StandardLayout>
