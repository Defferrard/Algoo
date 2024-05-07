<script lang="ts">
    import {createEventDispatcher} from 'svelte';
    import {afterUpdate, onMount} from "svelte";
    import {fly} from "svelte/transition";
    import {Player} from "@defferrard/algoo-core/src/game";
    import {Window} from "$lib/components/layout/";


    const dispatch = createEventDispatcher();

    export let room: string;
    export let messages: (string | { from: Player, message: string })[] = [];

    let messageInput: HTMLElement;
    let chat: HTMLElement;

    function sendMessage() {
        dispatch('send', {room: room, message: messageInput.value})
        messageInput.value = '';
    }

    onMount(() => {
        // messageInput.focus({preventScroll: true});
        messageInput.onfocus = (e) =>{
            e.preventDefault()
            window.scrollTo(0,0);
        }
    });

    let lastChatHeight = 0;
    afterUpdate(() => {
        chat.scroll({top: chat.scrollTop + chat.scrollHeight - lastChatHeight, behavior: 'smooth'});
        lastChatHeight = chat.scrollHeight;
    });
</script>

<Window>
    <div slot="header">
        Chat Box
    </div>
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

    <chatinput slot="footer">
        <input bind:this={messageInput}
               on:keypress={(event)=>{if(event.key === 'Enter') sendMessage();}}

        />
        <button class="material-symbols-rounded" on:click={sendMessage}>send</button>
    </chatinput>
</Window>

<style>
    chat {
        flex: 1;
        border-radius: .5em .5em 0 0;
        height: 60vh;
        display: block;
        padding: 0.5em;
        overflow-x: hidden;
        overflow-y: scroll;
    }

    chat > div {
        padding: 0 1em;
        word-break: break-all;

        color: var(--color-body-90);
        border-radius: 0.3em;

    }

    chat > div > b {
        color: var(--color-body);
        font-size: 1em;
    }

    chat > div.event {
        color: var(--color-body);
        font-size: 1.2em;
        text-align: center;
    }

    chat > div:nth-child(even) {
        background-color: var(--color-body-5);
    }

    chatinput {
        display: flex;
        justify-content: space-between;
    }

    button, input {
        border-radius: 0;

        font-size: 1.2em;
    }

    input {
        flex: 1;
        background-color: color-mix(in srgb, var(--color), var(--color-body));
        color: var(--color-bg);
    }

    @media (max-width: 600px) {
        button, input {
            font-size: 1em;
        }
    }
</style>