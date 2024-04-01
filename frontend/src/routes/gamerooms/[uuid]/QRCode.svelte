<script lang="ts">
    export let value: string;
</script>

<section>
    <qr style:mask-image={`url(https://api.qrserver.com/v1/create-qr-code/?data=${value}&format=svg)`}/>
    <button on:click={() => navigator.clipboard.writeText(value)}>
        Copy Invite Link
    </button>
</section>

<style>
    section {
        display: flex;
        flex-direction: column;
        gap: 1em;
    }

    button {
        cursor: pointer;
        padding: 0.5em 1em;
        border: solid 0.2em var(--color);
        border-radius: 0.5em;
        background: none;
        color: var(--color);
    }

    button:hover {
        background-color: var(--color);
        color: var(--color-lighter);
        transform: translateY(-0.2em);
    }

    button:active {
        background-color: var(--color);
        color: var(--color-lighter);
        transform: translateY(0.2em);
        filter: brightness(0.5);
    }

    qr {
        mask-mode: luminance;
        mask-size: contain;

        --gradient: color-mix(in srgb, var(--color), var(--color-light) var(--color-gap));
        background: linear-gradient(0deg, var(--color) 0%, var(--gradient) 100%);

        --size: 10em;
        height: var(--size);
        width: var(--size);
        display: block;

    }

</style>