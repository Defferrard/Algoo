<script lang="ts">
    import {page} from '$app/stores';
    import {socket} from '$lib/stores/socket';
    import {MessageType, User} from "@defferrard/algoo-core/src/socket";
    import {onMount, afterUpdate} from "svelte";
    import Chatbox from "./Chatbox.svelte";
    import QRCode from "./QRCode.svelte";

    export let data;
</script>
<section>

    <Chatbox room={data.uuid}/>

    <QRCode value={$page.url}/>
</section>

<style>


    section {
        padding: 5vw;

        display: flex;
        justify-content: center;
        filter: drop-shadow(0 0 0.2em black);
        gap: 3em;
        align-items: center;

        height: calc(100vh - 10vw);
    }


    @media (max-width: 800px) {
        section {
            flex-direction: column-reverse;
            gap: 1em;
            padding: 1em;

        }
    }
</style>