<script lang="ts">
    const turnTime = 60000; // 20 sec
    let percentage = 0;

    let last = Date.now();
    let next = last + turnTime;

    setInterval(() => {
        const now = Date.now();
        if (now > next) {
            last = now;
            next = last + turnTime;
        }
        percentage = (now - last) / (next - last) * 100;
    }, 100);
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