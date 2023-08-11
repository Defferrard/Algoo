<script lang="ts">
    import JSONObject from "$lib/components/json/JSONObject.svelte";
    import JSONArray from "$lib/components/json/JSONArray.svelte";

    export let data: any;
</script>

{#if data && typeof data === 'object'}
    {#if Array.isArray(data)}
        <JSONArray array={data} {...$$restProps}/>
    {:else}
        <JSONObject object={data} {...$$restProps}/>
    {/if}
{:else}
    {JSON.stringify(data)}
{/if}