<script lang="ts">
    import {JSON} from "$lib/components/index.js";

    export let object: {};

    export let show: boolean = true;
    let itemShow: boolean[] = Array.from({length: Object.keys(object).length}, () => true);
</script>

{#if Object.keys(object).length > 0}
    {#if show}
        {'{'}
        <jsonObject>
            {#each Object.keys(object) as key, i}
                <element>
                    <button class="key"
                         on:click={()=>{itemShow[i] ^= true;}}>
                        {key}
                    </button>
                    {':'}
                    <JSON data={object[key]} show={itemShow[i]}/>
                </element>
            {/each}
        </jsonObject>
        {'}'}
    {:else}
        {'{ ... }'}
    {/if}
{:else }
    {'{ }'}
{/if}

<style>
    jsonObject {
        display: block;
        border-left: dashed thin transparent;
        transition: 0.1s;
    }

    jsonObject:hover {
        border-left: dashed thin;
    }

    element {
        display: block;
        margin-left: 1em;
    }

    /* Transform button to a normal div looking */
    button.key{
        padding: 0;
        background-color: inherit;
        color: inherit;
        font-size: 1em;
        border:none;
    }

    .key {
        user-select: none;
        font-weight: bold;
        cursor: pointer;
    }

    .key:hover {
        text-decoration: underline;
    }
</style>