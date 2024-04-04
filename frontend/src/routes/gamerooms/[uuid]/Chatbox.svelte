<script lang="ts">
    import {createEventDispatcher} from 'svelte';
    import {afterUpdate, onMount} from "svelte";
    import {fly} from "svelte/transition";
    import {Player} from "@defferrard/algoo-core/src/game";


    const dispatch = createEventDispatcher();

    export let room: string;
    let messages: (string | { from: Player, message: string })[] = [`Welcome to the Game Room ${room}`];

    let messageInput: HTMLElement;
    let chat: HTMLElement;

    function sendMessage() {
        dispatch('send', {room: room, message: messageInput.value})
        messageInput.value = '';
    }

    export function pushMessage(message: string | { from: Player, message: string }) {
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
            <div transition:fly={{y:20}}>
                {#if message.from}
                    <b>{message.from.user.name}</b> : {message.message}
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
        <button class="material-symbols-rounded" on:click={sendMessage}>send</button>
    </chatinput>
</section>

<style>
    section {
        display: flex;
        flex-direction: column;

        transition: 0.2s;
        border-radius: 0.5em;

        outline: 0.2em solid var(--color);
        outline-offset: 0.2em;
        height: 100%;
        gap: 0.2em;
    }

    chat {
        flex: 1;
        background-color: rgb(var(--color-rgb), 0.7);
        border-radius: .5em .5em 0 0;

        display: block;
        padding: 0.5em 0;
        overflow-x: hidden;
        overflow-y: auto;

    }

    chat::-webkit-scrollbar-thumb,
    chat::-webkit-scrollbar-track{
        border-radius: 0 1em 0 0;
    }

    chat::-webkit-scrollbar-track {
        background-color: color-mix(in srgb, var(--color), black var(--color-gaper));
    }

    chat > div {
        padding: 0 1em;
        word-break: break-all;
    }

    chat > div:nth-child(even) {
        background-color: var(--color);
    }

    chatinput {
        display: flex;
        justify-content: space-between;
    }

    button, input {
        border-radius: 0;

        font-size: 1.5em;
    }

    button {
        border-bottom-right-radius: .3em;
    }

    input {
        border-bottom-left-radius: .3em;
        flex: 1;
    }
</style>