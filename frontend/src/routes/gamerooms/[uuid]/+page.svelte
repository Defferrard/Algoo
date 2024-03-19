<script lang="ts">
    import {page} from '$app/stores';
    import {socket} from '$lib/stores/socket';
    import {onMount, afterUpdate} from "svelte";
    import {MessageType} from "@defferrard/algoo-core/src/socket";
    import {JSON} from "$lib/components/index.js";

    export let data;

    let MESSAGES: [string] = [];
    let messageInput: HTMLElement;
    let chat: HTMLElement;
    let lastChatHeight = 0;

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
            room: data.uuid,
            message: messageInput.value
        });
        messageInput.value = '';
    }

    afterUpdate(() => {
        chat.scroll({top: chat.scrollTop + chat.scrollHeight - lastChatHeight, behavior: 'smooth'});
        lastChatHeight = chat.scrollHeight;
    });
</script>
<section>
    <chatbox>
        <chat bind:this={chat}>
            {#key MESSAGES}
                {#each MESSAGES as message}
                    <div>
                        <b>{message.from.name}</b> : {message.message}
                    </div>
                {/each}
            {/key}
        </chat>

        <chatinput>
            <input bind:this={messageInput} on:keypress={(event)=>{
        if(event.key === 'Enter') sendMessage();
    }}/>
            <button on:click={sendMessage}>send</button>
        </chatinput>
    </chatbox>

    <flex>
        <qr style:mask-image={`url(https://api.qrserver.com/v1/create-qr-code/?data=${$page.url}&format=svg)`}/>
        <button on:click={() => navigator.clipboard.writeText($page.url)}
        >Copy Invite Link</button>
    </flex>
</section>

<style>

    flex {
        display: flex;
        flex-direction: column;
        gap: 1em;
    }

    flex > button {
        cursor: pointer;
        padding: 0.5em 1em;
        border: solid 0.2em var(--color-main);
        border-radius: 0.5em;
        background: none;
        color: var(--color-main);
    }

    flex > button:hover {
        background-color: var(--color-main);
        color: var(--color-lighter);
        transform: translateY(-0.2em);
    }

    flex > button:active {
        background-color: var(--color-main);
        color: var(--color-lighter);
        transform: translateY(0.2em);
        filter: brightness(0.5);
    }

    qr {
        mask-mode: luminance;
        mask-size: contain;

        --gradient: color-mix(in srgb, var(--color-main), var(--color-light) var(--color-gap));
        background: linear-gradient(0deg, var(--color-main) 0%, var(--gradient) 100%);

        --size: 10em;
        height: var(--size);
        width: var(--size);
        display: block;

    }

    section {
        padding: 5vw;

        display: flex;
        justify-content: center;
        filter: drop-shadow(0 0 0.2em black);
        gap: 3em;
        align-items: center;
    }

    chatbox {
        display: block;
        transition: 0.2s;
        border-radius: 0.5em;
        width: 60vw;

        outline: 0.2em solid var(--color-main);
        outline-offset: 0.2em;

    }

    chat {
        background-color: rgb(var(--color-main-rgb), 0.7);
        border-radius: 0.5em;

        display: block;
        padding: 0.5em 0;
        overflow-x: hidden;
        overflow-y: auto;
        height: 70vh;
    }

    chat::-webkit-scrollbar-thumb {
        border-radius: 0 1em 1em 0;
    }

    chat::-webkit-scrollbar-track {
        border-radius: 0 1em 1em 0;
        background-color: color-mix(in srgb, var(--color-main), black var(--color-gaper));
    }

    chat > div {
        padding: 0 1em;
        word-break: break-all;
    }

    chat > div:nth-child(even) {
        background-color: var(--color-main);
    }

    chatinput {
        display: flex;
        justify-content: space-between;
        padding: 0.5em;
        gap: 1em;
    }

    chatinput > * {
        background-color: var(--color-main);
        color: var(--color-lighter);
        border: none;
        border-radius: 0.5em;
        font-size: 1.1em;
        padding: 0.3em 1em;
    }

    chatinput > input {
        flex: 1;
    }

    chatinput > button {
        cursor: pointer;
    }

    chatinput > button:hover {
        filter: brightness(1.5);
        transform: translateY(-0.2em);
    }

    chatinput > button:active {
        filter: brightness(0.5);
        transform: translateY(0.2em);
    }
</style>