<script lang="ts">
    import {page} from '$app/stores';
    import {socket} from '$lib/stores/socket';
    import {MessageType, SocketStatus, User} from "@defferrard/algoo-core/src/socket";
    import {onDestroy, onMount} from "svelte";
    import Chatbox from "./Chatbox.svelte";
    import QRCode from "./QRCode.svelte";
    import {goto} from "$app/navigation";
    import {StandardLayout} from "$lib/components/layout/index";

    export let data;

    let pushMessage;
    let users: User[] = [];

    let isReady:boolean = false;

    function setReady(){
        isReady = !isReady;
        socket.emit(MessageType.GAME_ROOM_READY, isReady);

        goto("/game")
    }

    onMount(async () => {
        await socket.connect()
        socket.emit(MessageType.GAME_ROOM_JOIN, data.uuid, ({status, data}: { status: SocketStatus, data }) => {
            if (status === SocketStatus.OK) {
                socket.on(MessageType.GAME_ROOM_MESSAGE, (message: { from: User, message: string }) => {
                    pushMessage(message);
                });
                socket.on(MessageType.GAME_ROOM_JOIN, (user: User) => {
                    users = [...users, user];
                    pushMessage(user.name + ' joined the room');
                });
                socket.on(MessageType.GAME_ROOM_LEAVE, (user: User) => {
                    users = users.filter(u => u.uuid !== user.uuid);
                    pushMessage(user.name + ' left the room');
                });
                users = data;
            } else {
                goto('/')
                throw new Error('The game room is already full or does not exist.');
            }
        });
    });

    onDestroy(() => {
        socket.emit(MessageType.GAME_ROOM_LEAVE, data.uuid);
    });
</script>
<StandardLayout>
    <section>
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
            <users>
                {#each users as user}
                    <user>{user.name}</user>
                {/each}
                {#if users.length === 2}
                    <br/>
                    <button on:click={setReady}>I'm ready !</button>
                {/if}
            </users>

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

        display: flex;
        justify-content: center;
        filter: drop-shadow(0 0 0.2em black);
        gap: 3em;
        align-items: center;

        height: calc(100vh - 10em);
    }

    subsection {
        justify-content: center;
        align-items: center;

        display: flex;
        flex-direction: column;
        gap: 1em;
    }

    user {
        display: block;
        width: 100%;
        text-align: center;
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