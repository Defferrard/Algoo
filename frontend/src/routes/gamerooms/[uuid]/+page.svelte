<script lang="ts">
    import { page } from '$app/stores';
    import { socket } from '$lib/stores/socket';
    import {onMount} from "svelte";
    export let data;

    onMount(() => {
        socket.connect();
    });
</script>
<section>
    <qr-container>
        <qr style:mask-image={`url(https://api.qrserver.com/v1/create-qr-code/?data=${$page.url}&format=svg)`}/>
    </qr-container>
</section>

<style>
    section {
        padding: 5vw;
        text-align: center;
    }

    qr {
        mask-mode: luminance;
        mask-size: contain;

        --gradient: color-mix(in srgb, var(--color-main), var(--color-light) var(--color-gap));
        background: linear-gradient(0deg, var(--color-main) 0%, var(--gradient) 100%);

        --size: 15em;
        height: var(--size);
        width: var(--size);
        display: block;
    }

    qr-container {
        display: flex;
        justify-content: center;
        filter: drop-shadow(0 0 0.2em black);

    }
</style>