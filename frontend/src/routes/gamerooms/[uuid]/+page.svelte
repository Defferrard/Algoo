<script lang='ts'>
  import { StandardLayout } from '$lib/components/layout/index';
  import { UIGameManager } from '$lib/game';
  import { GameRoomReadable } from '$lib/stores';
  import { authStore } from '$lib/stores/auth';
  import { localUser } from '$lib/stores/localUser';
  import { socket } from '$lib/stores/socket';
  import GameManagerDTO from '@defferrard/algoo-core/src/dto/GameManagerDTO';
  import { Player } from '@defferrard/algoo-core/src/game';
  import { GameRoomState } from '@defferrard/algoo-core/src/game/GameRoom.js';
  import { MessageType, User } from '@defferrard/algoo-core/src/socket';
  import { onDestroy, onMount } from 'svelte';
  import GameView from './GameView.svelte';
  import LobbyPage from './LobbyPage.svelte';

  export let data;
  let roomUuid = data.uuid;

  let gameRoom: GameRoomReadable = new GameRoomReadable(undefined, roomUuid);
  let gameManager: UIGameManager;
  let timeouts: { [key: string]: NodeJS.Timeout } = {}; // Key = Timeout Type
  let messages: (string | { from: Player, message: string })[] = [`Welcome to the Game Room ${roomUuid}`];
  const [jwt, loading, error, login] = authStore();

  function pushMessage(message: string | { from: Player, message: string }): void {
    messages = [...messages, message];
  }

  const ROUTES: { messageType: MessageType, handler: (...params: any) => void }[] = [
    {
      messageType: MessageType.PUT_GAME_ROOM,
      handler: (message: Player[]) => {
        for (let player of Object.values(message)) {
          gameRoom.addPlayer(player);
        }
      },
    },
    {
      messageType: MessageType.GAME_ROOM_MESSAGE,
      handler: (message: { from: Player, message: string }) => {
        pushMessage(message);
      },
    },
    {
      messageType: MessageType.GAME_ROOM_JOIN, handler: (player: Player) => {
        console.log('player', player);
        gameRoom.addPlayer(player);
        pushMessage(player.user.name + ' joined the room');
      },
    },
    {
      messageType: MessageType.GAME_ROOM_LEAVE, handler: (player: Player) => {
        gameRoom.removePlayer(player.user.uuid);
        pushMessage(player.user.name + ' left the room');
      },
    },
    {
      messageType: MessageType.GAME_ROOM_READY,
      handler: ({ from, isReady }: { from: Player, isReady: boolean }) => {
        gameRoom.setPlayerReady(from.user.uuid, isReady);
        pushMessage(from.user.name + ' is ' + (isReady ? 'ready' : 'not ready'));
      },
    },
    {
      messageType: MessageType.GAME_ROOM_STARTING,
      handler: (timer: number) => {
        timeouts[MessageType.GAME_ROOM_STARTING] = setInterval(() => {
          if (timer > 0) {
            pushMessage('Game starting in ' + timer / 1000 + ' seconds');
            timer -= 1000;
          } else {
            clearInterval(timeouts[MessageType.GAME_ROOM_STARTING]);
          }
        }, 1000);
      },
    },
    {
      messageType: MessageType.CANCEL_GAME_ROOM_STARTING, handler: () => {
        clearInterval(timeouts[MessageType.GAME_ROOM_STARTING]);
      },
    },
    {
      messageType: MessageType.GAME_ROOM_START,
      handler: (dto: GameManagerDTO) => {
        gameManager = new UIGameManager(dto);
        gameRoom.startGame(gameManager);
      },
    },
  ];


  $: if ($jwt) {
    socket.connect(roomUuid, $jwt);

    for (const route of ROUTES) {
      socket.on(route.messageType, route.handler);
    }
  }

  onMount(async () => {
    let player: Player = new Player($localUser as User);
    console.log('player', player);
    await login(player.user.name);
  });

  onDestroy(() => {
    socket.disconnect();
  });
</script>
<StandardLayout>
  {#if $gameRoom.state === GameRoomState.LOBBY}
    <LobbyPage roomUuid={roomUuid}
               {...{ messages, players: $gameRoom.players }} />
  {:else if $gameRoom.state === GameRoomState.PLAYING}
    <GameView {...{ gameManager }} />
  {/if}
</StandardLayout>
<float>
  <div on:click={()=>{
        $gameRoom.state = $gameRoom.state === GameRoomState.PLAYING ? GameRoomState.LOBBY : GameRoomState.PLAYING;
    }}>Swap
  </div>
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