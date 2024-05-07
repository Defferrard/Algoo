<script lang="ts">
    import {StandardLayout} from "$lib/components/layout/index";
    import LobbyPage from "./LobbyPage.svelte";
    import {onDestroy, onMount} from "svelte";
    import {socket} from "$lib/stores/socket";
    import {MessageType, SocketStatus, User} from "@defferrard/algoo-core/src/socket";
    import {Player} from "@defferrard/algoo-core/src/game";
    import {localUser} from "$lib/stores/localUser";
    import {goto} from "$app/navigation";
    import {GameRoomReadable} from "$lib/stores";
    import {GameRoomState} from "@defferrard/algoo-core/src/game/GameRoom.js";

    export let data;
    let roomUuid = data.uuid;

    let gameRoom: GameRoomReadable = new GameRoomReadable(undefined, roomUuid);
    let timeouts: { [key: string]: NodeJS.Timeout } = {}; // Key = Timeout Type
    let messages: (string | { from: Player, message: string })[] = [`Welcome to the Game Room ${roomUuid}`];

    function pushMessage(message: string | { from: Player, message: string }): void {
        messages = [...messages, message];
    }

    const ROUTES: { messageType: MessageType, handler: (...params: any) => void }[] = [
        {
            messageType: MessageType.GAME_ROOM_MESSAGE, handler: (message: { from: Player, message: string }) => {
                pushMessage(message);
            }
        },
        {
            messageType: MessageType.GAME_ROOM_JOIN, handler: (player: Player) => {
                gameRoom.addPlayer(player);
                pushMessage(player.user.name + ' joined the room');
            }
        },
        {
            messageType: MessageType.GAME_ROOM_LEAVE, handler: (player: Player) => {
                gameRoom.removePlayer(player.user.uuid);
                pushMessage(player.user.name + ' left the room');
            }
        },
        {
            messageType: MessageType.GAME_ROOM_READY,
            handler: ({from, isReady}: { from: Player, isReady: boolean }) => {
                gameRoom.setPlayerReady(from.user.uuid, isReady)
                pushMessage(from.user.name + ' is ' + (isReady ? 'ready' : 'not ready'));
            }
        },
        {
            messageType: MessageType.GAME_ROOM_STARTING, handler: (timer: number) => {
                timeouts[MessageType.GAME_ROOM_STARTING] = setInterval(() => {
                    if (timer > 0) {
                        pushMessage('Game starting in ' + timer / 1000 + ' seconds');
                        timer -= 1000;
                    } else {
                        clearInterval(timeouts[MessageType.GAME_ROOM_STARTING]);
                    }
                }, 1000);
            }
        },
        {
            messageType: MessageType.CANCEL_GAME_ROOM_STARTING, handler: () => {
                clearInterval(timeouts[MessageType.GAME_ROOM_STARTING]);
            }
        },
        {
            messageType: MessageType.GAME_ROOM_START, handler: () => {
                gameRoom.startGame();
            }
        },
    ]

    onMount(async () => {
        await socket.connect()
        let player: Player = new Player($localUser as User);
        socket.emit(MessageType.GAME_ROOM_JOIN,
            {roomUuid: roomUuid, player},
            ({status, data}: { status: SocketStatus, data: Player[] }) => {
                if (status === SocketStatus.OK) {
                    for (let route of ROUTES) {
                        socket.on(route.messageType, route.handler);
                    }
                    for (let player of Object.values(data)) {
                        gameRoom.addPlayer(player);
                    }
                } else {
                    goto('/')
                    throw data;
                }
            });

    });

    onDestroy(() => {
        socket.emit(MessageType.GAME_ROOM_LEAVE, roomUuid);
    });
</script>
<StandardLayout>
    {#if $gameRoom.state === GameRoomState.LOBBY}
        <LobbyPage roomUuid={roomUuid} {...{messages, players: $gameRoom.players}}/>
    {:else if $gameRoom.state === GameRoomState.PLAYING}

    {/if}
</StandardLayout>
