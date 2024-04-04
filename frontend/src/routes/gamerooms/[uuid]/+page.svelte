<script lang="ts">
    import {page} from '$app/stores';
    import {socket} from '$lib/stores/socket';
    import {MessageType, SocketStatus, User} from "@defferrard/algoo-core/src/socket";
    import {onDestroy, onMount} from "svelte";
    import Chatbox from "./Chatbox.svelte";
    import QRCode from "./QRCode.svelte";
    import {goto} from "$app/navigation";
    import {StandardLayout} from "$lib/components/layout/index";
    import {Player} from "@defferrard/algoo-core/src/game";
    import {localUser} from "$lib/stores/localUser";

    export let data;

    let pushMessage;
    let players: Player[] = [];

    let isReady: boolean = false;

    function setReady() {
        isReady = !isReady;
        socket.emit(MessageType.GAME_ROOM_READY, {room: data.uuid, isReady});
        // goto("/game")
    }

    let marginBottom = 0;

    onMount(async () => {

        await socket.connect()
        let player: Player = new Player($localUser as User);
        socket.emit(MessageType.GAME_ROOM_JOIN,
            {room: data.uuid, player},
            ({status, data}: { status: SocketStatus, data }) => {
                if (status === SocketStatus.OK) {
                    socket.on(MessageType.GAME_ROOM_MESSAGE, (message: { from: Player, message: string }) => {
                        pushMessage(message);
                    });
                    socket.on(MessageType.GAME_ROOM_JOIN, (player: Player) => {
                        console.log(players);
                        players = [...players, player];
                        pushMessage(player.user.name + ' joined the room');

                    });
                    socket.on(MessageType.GAME_ROOM_LEAVE, (player: Player) => {
                        players = players.filter(p => p.user.uuid !== player.user.uuid);

                        pushMessage(player.user.name + ' left the room');
                    });
                    socket.on(MessageType.GAME_ROOM_READY, ({from, isReady}: { from: Player, isReady: boolean }) => {
                        players = players.map(p => {
                            if (p.user.uuid === from.user.uuid) {
                                p.isReady = isReady;
                            }
                            return p;
                        });

                        pushMessage(from.user.name + ' is ' + (isReady ? 'ready' : 'not ready'));
                    });
                    players = data;
                } else {
                    goto('/')
                    throw data;
                }
            });

        navigator.virtualKeyboard.addEventListener('geometrychange', (event) => {
            const { x, y, width, height } = event.target.boundingRect;
            marginBottom = height;
            console.log('Virtual keyboard geometry changed:', x, y, width, height);
        });


    });

    onDestroy(() => {
        socket.emit(MessageType.GAME_ROOM_LEAVE, data.uuid);
    });


</script>
<StandardLayout>
    <section style:--margin-bottom={marginBottom+"px"}>
        <chatbox>
            <Chatbox room={data.uuid}
                     on:send={e => {
                 console.log(e.detail);
                socket.emit(MessageType.GAME_ROOM_MESSAGE, {
                    room: e.detail.room,
                    message: e.detail.message
                });
            }}
                     bind:pushMessage
            />
        </chatbox>

        <subsection>
            <qrcode>
                <QRCode value={$page.url}/>
            </qrcode>
            <players>
                <b>Players ({players.length}/2)</b>
                {#each players as player}
                    <player>
                        <name>{player.user.name}</name>

                        <icon class="material-symbols-rounded" class:ready={player.isReady}>
                            {#if player.isReady}
                                task_alt
                            {:else}
                                progress_activity
                            {/if}
                        </icon>
                    </player>
                {/each}
                {#if players.length === 2}
                    <br/>
                    <button on:click={setReady}>I'm ready !</button>
                {/if}
            </players>

        </subsection>
    </section>
</StandardLayout>

<style>
    chatbox {
        align-self: stretch;
        flex: 1;
    }

    section {
        padding: 5em 5vw;
        --margin-bottom: 0;


        display: flex;
        justify-content: center;
        filter: drop-shadow(0 0 0.2em black);
        gap: 3em;
        align-items: center;

        height: calc(100% - 10em - var(--margin-bottom));
    }

    subsection {
        justify-content: center;
        align-items: center;

        display: flex;
        flex-direction: column;
        gap: 1em;
    }

    players {
        display: flex;
        flex-direction: column;
        gap: .2em;
    }

    player {
        display: flex;
        width: 100%;
        align-items: center;
        gap: .5em
    }

    player > icon {
        opacity: .3;
        transform: rotate(0deg);
    }

    player > icon.ready{
        color: var(--color);
        opacity: 1;
        animation: rotate 1s infinite;
        transform: rotate(360deg);
    }




    @media (max-width: 800px) {
        section {
            flex-direction: column-reverse;
            gap: 1em;
            padding: 1em;
            height: calc(100vh - 2em);
        }

        subsection {
            flex-direction: row-reverse;
            justify-content: flex-start;
            align-self: stretch;
            padding: 0 1em;
        }

        qrcode {
            font-size: 0.75em;
        }
    }
</style>