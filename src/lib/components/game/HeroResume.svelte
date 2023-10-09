<script lang="ts">
    import {receive, send} from "../../animations/translate";
    import {fly} from "svelte/transition";
    import {HeroEntity, ResourceColor, Spell} from "../../game/";
    import type {Readable} from "svelte/store";
    import {readable} from "svelte/store";
    import {getCSS, Color} from "../Color";
    import {backInOut} from "svelte/easing";

    export let hero: Readable<HeroEntity | undefined>;

    export let spellPreview: Readable<Spell | undefined> = readable();

    export let stickRight: boolean = false;
</script>

{#key stickRight ? $hero : undefined}
    <resume transition:fly={stickRight?{x:200, duration:500, easing:backInOut}:undefined}

            style:position={stickRight?"absolute":undefined}
            style:right={stickRight?0:undefined}
            style:--color={getCSS($hero?.team.color || Color.BODY)}>
        {#if $hero}

            <icon>
                <div style:background-color="var(--color)" style:height="100%" style:width="100%">
                </div>
            </icon>
            <info>
                <name>
                    {$hero.name}
                </name>
                <title>
                    {$hero.title}
                </title>

                {#each Object.keys($hero.characteristics.max) as resource}
                    <statsbar style:--color={getCSS(ResourceColor[resource])}
                              style:--max-percent={$hero.characteristics.max[resource]*5+'%'}
                              style:--percent={$hero.resources[resource]*100/$hero.characteristics.max[resource] +'%'}
                              style:--preview-percent={($hero.resources[resource]-($spellPreview?.cost[resource] || 0))*100/$hero.characteristics.max[resource] +'%'}>
                        <value>
                            {$hero.resources[resource]}
                            {#if $spellPreview && $spellPreview.cost[resource]}
                                - {$spellPreview.cost[resource]}
                            {/if}
                            / {$hero.characteristics.max[resource]} {resource}
                        </value>

                        {#if $spellPreview}
                            <previewbar transition:fly></previewbar>
                        {/if}
                        <bar></bar>

                    </statsbar>
                {/each}
            </info>
        {/if}
    </resume>
{/key}

<style>
    resume {
        --color: black;
        --color-indicator-shadow: color-mix(in srgb, var(--color), black 70%);
        filter: drop-shadow(0 0 1em var(--color-indicator-shadow));

        font-size: 2.5vh;
        color: white;
        display: flex;
        flex-direction: row-reverse;
        margin-bottom: 1em;
    }

    icon {
        height: 15vh;
        width: 15vh;
        display: flex;
        justify-content: center;
        align-items: center;
        transform: rotate(15deg);
        background-color: white;
        padding: 0.5em;
        border-radius: 1em;
        z-index: 1;
    }

    icon div {
        height: 100%;
        width: 100%;
        border-radius: 0.5em;
    }

    info {
        transform: skew(-15deg);
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 0.2em;
    }

    name, title {
        overflow: hidden;
        background-color: black;
        display: block;
        padding: 0 15% 0 10%;

        /* Fit in 1 line */
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }

    name {
        font-size: 1.5em;
    }

    statsbar {
        --max-percent: 0%;
        --percent: 0%;
        --preview-percent: 0%;
        --display: '';
        margin-right: -0.5em;

        width: calc(var(--max-percent) + 5em);
        background-color: color-mix(in srgb, var(--color), transparent 70%);
        position: relative;

    }

    bar, previewbar {
        float: right;
        background-color: var(--color);
        position: absolute;
        right: 0;
    }

    bar {
        width: var(--preview-percent);
        border-left: solid 0.4em;
    }

    previewbar {
        width: var(--percent);
        border-left: solid 0.2em;

        animation-name: blink;
        animation-duration: 1s;
        animation-iteration-count: infinite;
        filter: brightness(0.7);
    }

    statsbar:after, bar:after, bar, previewbar:after, previewbar {
        content: ' ';
        display: inline-block;
    }

    value {
        white-space: nowrap;
        position: relative;
        margin-right: calc(100% + 1em);
        float: right;
        display: inline-block;
        text-shadow: 0 0 0.5em black;
        z-index: 1;
        filter: drop-shadow(0 0 1em black);
    }

    @keyframes blink {
        0% {
            filter: brightness(0.7);
        }
        50% {
            filter: brightness(0.5);
        }
        100% {
            filter: brightness(0.7);
        }
    }

</style>