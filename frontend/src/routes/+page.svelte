<script lang="ts">
    import {JSON} from "$lib/components/index.js";

    const URL = "defferrard.dev";

    let games: string[] = [];
</script>
<section>
    <button >
        Create Game
    </button>
    <JSON data={games}></JSON>
</section>

<style>
    section {
        padding: 5vw;
    }
</style>