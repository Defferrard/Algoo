<script lang="ts">
    import {socket} from '$lib/stores/socket';
    import {localUser} from '$lib/stores/localUser';

    export let open = false;
</script>


<tab class:open>
    <button class="material-symbols-rounded" on:click={()=> open = !open}>
        account_circle
    </button>
    {#if $socket.connected}
        <username>
            {$localUser.name}
        </username>
    {:else}
        <input value={$localUser.name} on:change={(e)=> localUser.setUsername(e.target.value)}/>
    {/if}


    <icon class="material-symbols-rounded" class:connected={$socket.connected}>
        {#if $socket.connected}
            link
        {:else}
            link_off
        {/if}
    </icon>

</tab>

<style>

    tab > * {
        height: 100%;
    }
    tab.open > input {
        width: 10em;
        padding: 0.1em 1em;
    }


    tab.open > username {
        width: auto;
    }

    tab.open > input, tab.open > username {
        margin: 0 0.5em;

        opacity: 1;
    }

    username, input{
        font-size: 0.75em;
        overflow: hidden;
    }

    username{
        opacity: 0;
        width: 0;
    }

    input {
        border: none;
        width: 0;
        border-radius: 5em;
        margin: 0;
        padding: 0;
        background-color: rgba(0, 0, 0, 0.3);
        color: var(--color-light);
        opacity: 0;
    }

    tab.open > input:disabled {
        display: inline;
        padding: 0;

    }

    button {
        margin: 0;
        padding: 0;
        font-size: 1em;
        border: none;
        background: none;
        color: white;
    }

    button:hover {
        filter: brightness(1.5);
        transform: scale(1.3) rotate(10deg);
    }

    button:active {
        filter: brightness(0.5);
        transform: scale(0.8) rotate(25deg);

    }

    tab {
        z-index: 1;

        transition: 0.2s;
        display: flex;
        padding: 0.2em 0.1em;
        user-select: none;

        font-size: 3em;
        background-color: rgba(0, 0, 0, 0);
        gap: 0.2em;
        border-radius: 0 5.2em 5.2em 0;
    }

    tab.open {
        padding: 0.2em 0.2em 0.2em 0.1em;
        background-color: rgba(0, 0, 0, 0.3);

    }

    icon {
        font-size: 1em;
        opacity: 0.2;
    }

    icon.connected {
        color: var(--color);
        transform: rotate(-45deg);
        opacity: 1;
    }
</style>