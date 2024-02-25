<script lang="ts">
    export let percentage: number;
</script>


<bar style:width={percentage+"%"}></bar>

<style>
    bar {
        height: 0.5vh;
        background-color: var(--color);
        box-shadow: 1em 0 2em 0.5em black;

        position: fixed;
        bottom: 0;
        z-index: 0;
    }
</style>