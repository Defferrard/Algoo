<script lang='ts'>
    import {localUser} from '$lib/stores/localUser';
    import {socket} from '$lib/stores/socket';
    import {theme} from "$lib/stores/theme";
    import {Theme} from "$lib/utils/Theme";

    export let open = false;

    function swapTheme() {
        theme.swap();
    }
</script>


<tab class:open>
    <button class='material-symbols-rounded' on:click={()=> open = !open}>
        settings
    </button>
    {#if $socket?.connected}
        <username>
            {$localUser.name}
        </username>
    {:else}
        <input value={$localUser.name}
               on:change={(e)=> localUser.setUsername(e.target.value)}/>

    {/if}


    <icon class='material-symbols-rounded' class:connected={$socket?.connected}>
        {#if $socket?.connected}
            link
        {:else}
            link_off
        {/if}
    </icon>


    <button class='material-symbols-rounded' on:click={swapTheme}>
        {#if $theme === Theme.LIGHT}
            light_mode
        {:else if $theme === Theme.DARK}
            dark_mode
        {:else} <!-- Theme.SYSTEM -->
            devices
        {/if}
    </button>

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

    username, input {
        font-size: 0.75em;
        overflow: hidden;
    }

    username {
        opacity: 0;
        width: 0;
    }

    button, icon {
        color: white;
    }

    tab.open > button, tab.open > input, tab.open > icon {
        color: var(--color-body);
    }

    input {
        border: none;
        width: 0;
        border-radius: .5em;
        margin: 0;
        padding: 0;
        background: var(--color-body-5);
        opacity: 0;
        position: relative;
    }

    input::after {
        content: 'edit';
        position: absolute
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

        display: flex;
        align-items: center;
        padding: 0.2em 0.1em;
        user-select: none;

        font-size: 3em;
        background-color: rgba(0, 0, 0, 0);
        gap: 0.2em;
        border-radius: 0 .5em .5em 0;
        transition: 0.2s;

    }

    tab.open {
        padding: 0.2em 0.2em 0.2em 0.1em;
        background-color: var(--color-bg);

    }

    icon {
        font-size: 1em;
    }

    icon.connected {
        color: var(--color);
        transform: rotate(-45deg);
        opacity: 1;
    }
</style>