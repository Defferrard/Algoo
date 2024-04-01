<script lang="ts">
    import { goto } from '$app/navigation';
    import ProfileTab from "$lib/components/profile/ProfileTab.svelte";
</script>

<tab>
    <button on:click={()=>goto("/")}>
        <img src="/img/uncolored_icon.svg" alt="icon"/>
    </button>
    <profile>
        <ProfileTab/>
    </profile>
</tab>

<style>
    img {
        width: 1em;
        height: 1em;
    }

    tab {
        font-size: 0.7em;
        display: flex;
        align-items: center;
        position: absolute;
        top: 0.5em;
        left: 0.5em;
        z-index: 100;
    }

    profile {
        font-size: 0.9em;
    }

    button{
        font-size: 4.5em;
        background: var(--color);
        border-radius: 0.1em;
        overflow: hidden;
        width: 1em;
        height: 1em;

        border: unset;
        padding: unset;
        margin: unset;

        cursor: pointer;
    }

    button:active, button:hover{
        transform: none;
    }
</style>