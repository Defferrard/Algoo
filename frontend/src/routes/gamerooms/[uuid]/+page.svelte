<script lang="ts">
    import {page} from '$app/stores';
    import {socket} from '$lib/stores/socket';
    import {localUser} from "$lib/stores/localUser";
    import {MessageType, SocketStatus, User} from "@defferrard/algoo-core/src/socket";
    import {onMount} from "svelte";
    import Chatbox from "./Chatbox.svelte";
    import QRCode from "./QRCode.svelte";

    export let data;

    let pushMessage;
    let users: User[] = [];

    onMount(async () => {
        await socket.connect()
        socket.emit(MessageType.GAME_ROOM_JOIN, data.uuid, ({status, data}:{status:SocketStatus})=>{
            if(status === SocketStatus.OK){
                socket.on(MessageType.GAME_ROOM_MESSAGE, (message: { from: User, message: string }) => {
                    pushMessage(message);
                });
                socket.on(MessageType.GAME_ROOM_JOIN, (player: any) => {
                    users = [...users, player._user];
                    pushMessage(player._user.name + ' joined the room');
                });
                users = data;
            }else {
                alert(JSON.stringify(data))
            }
        });


    });
</script>
<section>

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

    <subsection>
        <QRCode value={$page.url}/>
        <div>
            {#each users as user}
                <div>{user.name}</div>
            {/each}
        </div>
        <button>I'm ready !</button>
    </subsection>
</section>

<style>


    section {
        padding: 5vw;

        display: flex;
        justify-content: center;
        filter: drop-shadow(0 0 0.2em black);
        gap: 3em;
        align-items: center;

        height: calc(100vh - 10vw);
    }

    subsection {
        justify-content: center;
        align-items: center;

        display: flex;
        flex-direction: column;
        gap: 1em;
    }


    @media (max-width: 800px) {
        section {
            flex-direction: column-reverse;
            gap: 1em;
            padding: 1em;

        }
    }
</style>