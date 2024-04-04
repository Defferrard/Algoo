<script lang="ts">
    import {  fly } from "svelte/transition";

    export let animationDuration = 200;
    export let animate = true;
</script>

<section>
    <div out:fly={animate?{duration:animationDuration, y:-animationDuration}:undefined}
         in:fly={animate?{delay:animationDuration, y:animationDuration}:undefined}>
        <slot/>
    </div>
</section>

<style>
    section, div {
        height: 100%;
    }
</style>