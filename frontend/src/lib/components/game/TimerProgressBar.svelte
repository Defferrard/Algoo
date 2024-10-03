<script lang="ts">
    export let percentage: number;
</script>


<bar style:width={percentage+"%"}></bar>

<style>
    bar {
        height: 0.5vh;
        background-color: var(--color);
        box-shadow: 0 0 1px 1px var(--color-bg);

        position: fixed;
        bottom: 0;
        z-index: 0;
    }
</style>