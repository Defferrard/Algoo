<script lang="ts">
    import {createEventDispatcher} from 'svelte';
    import {User} from "@defferrard/algoo-core/src/socket";
    import {afterUpdate, onMount} from "svelte";


    const dispatch = createEventDispatcher();

    export let room: string;
    let messages: (string | { from: User, message: string })[] = [`Welcome to the Game Room ${room}`];

    let messageInput: HTMLElement;
    let chat: HTMLElement;

    function sendMessage() {
        dispatch('send', {room: room, message: messageInput.value})
        messageInput.value = '';
    }

    export function pushMessage(message: string | { from: User, message: string }) {
        messages = [...messages, message];
    }

    onMount(() => {
        messageInput.focus();
    });

    let lastChatHeight = 0;
    afterUpdate(() => {
        chat.scroll({top: chat.scrollTop + chat.scrollHeight - lastChatHeight, behavior: 'smooth'});
        lastChatHeight = chat.scrollHeight;
    });
</script>

<section>
    <chat bind:this={chat}>
            {#each messages as message}
                <div>
                    {#if message.from}
                        <b>{message.from.name}</b> : {message.message}
                    {:else}
                        <b>{message}</b>
                    {/if}
                </div>
            {/each}
    </chat>

    <chatinput>
        <input bind:this={messageInput} on:keypress={(event)=>{
        if(event.key === 'Enter') sendMessage();
    }}/>
        <button on:click={sendMessage}>►</button>
    </chatinput>
</section>

<style>
    section {
        display: flex;
        flex-direction: column;

        transition: 0.2s;
        border-radius: 0.5em;

        outline: 0.2em solid var(--color-main);
        outline-offset: 0.2em;
        height: 100%;
    }

    chat {
        flex: 1;
        background-color: rgb(var(--color-main-rgb), 0.7);
        border-radius: 0.5em;

        display: block;
        padding: 0.5em 0;
        overflow-x: hidden;
        overflow-y: auto;

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