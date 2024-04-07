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

    export function pushMessage(message: string | { from: Player, message: string }): void {
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
            <div transition:fly={{y:20}} class:event={!message.from}>
                {#if message.from}
                    <b>{message.from.user.name}</b> : {message.message}
                {:else}
                    {message}
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
    chat::-webkit-scrollbar-track {
        border-radius: 0 1em 0 0;
    }

    chat::-webkit-scrollbar-track {
        background-color: color-mix(in srgb, var(--color), black var(--color-gaper));
    }

    chat > div {
        padding: 0 1em;
        word-break: break-all;

        color: color-mix(in srgb, var(--color-lighter), var(--color-body) 10%);

    }

    chat > div > b {
        color: color-mix(in srgb, var(--color-lighter), var(--color-body) 5%);
        font-size: 1em;
    }

    chat > div.event{
        color: var(--color-lighter);
        font-size: 1.2em;
        text-align: center;
    }

    chat > div:nth-child(even) {
        background-color: color-mix(in srgb, var(--color), var(--color-body) var(--color-gap));
    }

    chatinput {
        display: flex;
        justify-content: space-between;
    }

    button, input {
        border-radius: 0;
        --border-radius: .3em;

        font-size: 1.5em;
    }

    button {
        border-bottom-right-radius: var(--border-radius);
    }

    input {
        border-bottom-left-radius: var(--border-radius);
        flex: 1;
    }

    @media (max-width: 600px) {
        button, input {
            --border-radius: .5em;

            font-size: 1em;
        }
    }
</style>