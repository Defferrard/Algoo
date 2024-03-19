<script lang="ts">
    import {socket} from '$lib/stores/socket';
    import {localUser} from '$lib/stores/localUser';

    export let open = false;
</script>


<tab class:open>
    <button class="material-symbols-rounded" on:click={()=> open = !open}>
        account_circle
    </button>
    <input value={$localUser.name} disabled={$socket.connected}
           on:change={(e)=> localUser.setUsername(e.target.value)}
    />
</tab>

<style>
    tab.open > input {
        width: 25em;
        padding: 0 2em;
        opacity: 1;

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

    input:disabled {
        background-color: rgba(0, 0, 0, 0);
        width: auto !important;
    }

    button {
        margin: 0;
        padding: 0;
        font-size: 1em;
        border: none;
        background: none;
        color: white;
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
</style>