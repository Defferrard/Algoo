<script lang="ts">
    import {page} from '$app/stores';
    import {socket} from '$lib/stores/socket';
    import {MessageType} from "@defferrard/algoo-core/src/socket";
    import Chatbox from "./Chatbox.svelte";
    import QRCode from "./QRCode.svelte";
    import {Player} from "@defferrard/algoo-core/src/game";
    import {Window} from "$lib/components/layout/";

    export let roomUuid: string;
    export let messages: (string | { from: Player, message: string })[] = [];


    export let players: { [key: string]: Player } = {};

    let isReady: boolean = false;

    function setReady() {
        isReady = !isReady;
        socket.emit(MessageType.GAME_ROOM_READY, {roomUuid: roomUuid, isReady});
        // goto("/game")
    }

</script>
<section>
    <chatbox>
        <Chatbox room={roomUuid} {messages}
                 on:send={e => {
                socket.emit(MessageType.GAME_ROOM_MESSAGE, {
                    roomUuid: roomUuid,
                    message: e.detail.message
                });
            }}
        />
    </chatbox>

        <Window>
            <div slot="header">Game Room</div>
            <subsection>
                <qrcode>
                    <QRCode value={$page.url}/>
                </qrcode>
                <players>
                    <b>Players ({Object.keys(players).length}/2) </b>
                    {#each Object.values(players) as player}
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
                    {#if Object.keys(players).length === 2}
                        <br/>
                        <button on:click={setReady}>I'm ready !</button>
                    {/if}
                </players>
            </subsection>
        </Window>
</section>


<style>
    chatbox {
        align-self: stretch;
        flex: 1;
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
        padding-top: 1em;
        align-items: center;

        display: flex;
        flex-direction: column;
        gap: 1em;
        height: 25em;
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
            padding: 1em;
            align-self: stretch;
            height: calc(100% - 4em);

        }

        chatbox {
            flex: none;
            height: calc(100% - 10em);;
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