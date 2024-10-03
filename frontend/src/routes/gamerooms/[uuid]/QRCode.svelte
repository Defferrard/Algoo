<script lang="ts">
    export let value: string;
</script>

<section>
    <qr style:mask-image={`url(https://api.qrserver.com/v1/create-qr-code/?data=${value}&format=svg&bgcolor=000&color=fff)`}/>
    <button on:click={() => navigator.clipboard.writeText(value)}>
        Copy Invite Link
    </button>
</section>

<style>
    section {
        display: flex;
        flex-direction: column;
        gap: .5em;
    }

    button {
        cursor: pointer;
        background: none;
        color: var(--color);
        text-decoration: underline;
        text-decoration-color: transparent;
    }

    button:hover {
        text-decoration-color: var(--color);

    }


    qr {
        mask-mode: luminance;
        mask-size: 10em;

        --gradient: color-mix(in srgb, var(--color-body), var(--color-body) var(--color-gap));
        background: linear-gradient(0deg, var(--color-body) 0%, var(--gradient) 100%);

        --size: 10em;
        height: var(--size);
        width: var(--size);
        display: block;

    }

</style>