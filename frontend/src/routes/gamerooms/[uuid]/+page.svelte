<script lang="ts">
    import {page} from '$app/stores';
    import {socket} from '$lib/stores/socket';
    import {onMount} from "svelte";
    import {MessageType} from "@defferrard/algoo-core/src/socket";
    import {JSON} from "$lib/components/index.js";

    export let data;

    let MESSAGES: [string] = [];
    let messageInput: HTMLElement;

    onMount(async () => {
        await socket.connect()
        socket.emit(MessageType.GAME_ROOM_JOIN, data.uuid);

        socket.on(MessageType.GAME_ROOM_MESSAGE, (message: string) => {
            MESSAGES.push(message);
            MESSAGES = [...MESSAGES];
        });

        messageInput.focus()
    });

    async function sendMessage() {
        await socket.emit(MessageType.GAME_ROOM_MESSAGE, {
            room:data.uuid,
            message: messageInput.value
        });
        messageInput.value = '';
    }
</script>
<section>
    <qr-container>
        <qr style:mask-image={`url(https://api.qrserver.com/v1/create-qr-code/?data=${$page.url}&format=svg)`}/>
    </qr-container>
    <br/>
    <div style:text-align="left">
        {#key MESSAGES}
            {#each MESSAGES as message}
                <div>
                    <b>{message.from.name}</b> : {message.message}
                </div>
            {/each}
        {/key}
    </div>
    <input bind:this={messageInput} on:keypress={(event)=>{
        if(event.key === 'Enter') sendMessage();
    }} />
    <button on:click={sendMessage}>send</button>
</section>

<style>
    section {
        padding: 5vw;
        text-align: center;
    }

    qr {
        mask-mode: luminance;
        mask-size: contain;

        --gradient: color-mix(in srgb, var(--color-main), var(--color-light) var(--color-gap));
        background: linear-gradient(0deg, var(--color-main) 0%, var(--gradient) 100%);

        --size: 15em;
        height: var(--size);
        width: var(--size);
        display: block;
    }

    qr-container {
        display: flex;
        justify-content: center;
        filter: drop-shadow(0 0 0.2em black);

    }
</style>