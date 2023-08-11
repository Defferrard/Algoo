<script lang="ts">
    import {JSON} from "$lib/components/index.js";

    export let array: [];
    export let show: boolean = true;
    let itemShow: Record<number, boolean> = {};
</script>

{'['}
{#if show}
<jsonArray>
    {#each array as data}
        <element>
            <JSON data={data}/>
        </element>
    {/each}
</jsonArray>
{:else}
    ...
{/if}
{']'}

<style>
    jsonArray {
        display: block;
        border-left: dashed thin transparent;
        transition: 0.1s;
    }
    jsonArray:hover{
        border-left: dashed thin;
    }
    element {
        display: block;
        margin-left: 1em;
    }
</style>