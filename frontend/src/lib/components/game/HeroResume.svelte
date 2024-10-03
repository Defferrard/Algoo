<script lang="ts">
  import { fly } from 'svelte/transition';
  import { backInOut } from 'svelte/easing';
  import { fade } from 'svelte/transition';

  import type { HeroEntity, Spell } from '@defferrard/algoo-core/src/game';
  import { RESSOURCES_COLOR } from '@defferrard/algoo-core/src/game';

  import HeroComponent from './HeroComponent.svelte';
  import { getCSS, SystemColor } from '../Color';
  import mousePosition from '$lib/utils/store/mousePosition';
  import { objectEntries } from '@defferrard/algoo-core/src/utils/typeCasting';

  export let hero: HeroEntity | undefined = undefined;

  export let spellPreview: Spell | undefined = undefined;

  export let stickRight: boolean = false;
</script>

{#key stickRight ? hero : undefined}
  <resume
    transition:fly={stickRight ? { x: 200, duration: 500, easing: backInOut } : undefined}
    style:position={stickRight ? 'absolute' : undefined}
    style:right={stickRight ? 0 : undefined}
    style:--color={getCSS(hero?.team?.color || SystemColor.BODY)}
  >
    {#if hero}
      <icon>
        {#key hero}
          <inner-icon transition:fade={{ duration: 200 }}>
            <HeroComponent dropShadow={true} lookAt={$mousePosition} {hero} />
          </inner-icon>
        {/key}
      </icon>
      <info>
        <name>
          {hero.name}
        </name>
        <title>
          {hero.title}
        </title>

        {#each objectEntries(hero.characteristics.max) as [key, value]}
          <statsbar
            style:--color={getCSS(RESSOURCES_COLOR[key] || SystemColor.BODY)}
            style:--max-percent={value * 5 + '%'}
            style:--percent={(hero.resources[key] * 100) / value + '%'}
            style:--preview-percent={((hero.resources[key] - (spellPreview?.cost[key] || 0)) * 100) / value + '%'}
          >
            <value>
              {hero.resources[key]}
              {#if spellPreview && spellPreview.cost[key]}
                - {spellPreview.cost[key]}
              {/if}
              / {value}
              {key}
            </value>

            {#if spellPreview}
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

    font-size: 2.5vh;
    color: white;
    display: flex;
    flex-direction: row-reverse;
    margin-bottom: 1em;
  }

  icon {
    min-height: 15vh;
    min-width: 15vh;
    transform: rotate(15deg);
    background-color: color-mix(in srgb, var(--color), black 70%);
    border: outset 0.5em white;
    padding: 0.5em;
    border-radius: 1em;
    z-index: 1;
    box-shadow:
      inset 0 0 2em black,
      0 0 2px black;
    position: relative;
  }

  inner-icon {
    height: 100%;
    width: 100%;
    border-radius: 0.5em;
    transform: rotate(-15deg);
    font-size: 6em;

    position: absolute;
    top: 0;
    left: 0;
    display: block;
  }

  info {
    transform: skew(-15deg);
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.2em;
    width: 5em;
  }

  name,
  title {
    overflow: hidden;
    background-color: color-mix(in srgb, black 60%, transparent);
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

  bar,
  previewbar {
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

  statsbar:after,
  bar:after,
  bar,
  previewbar:after,
  previewbar {
    content: ' ';
    display: inline-block;
  }

  value {
    color: var(--color-body);
    white-space: nowrap;
    position: relative;
    margin-right: calc(100% + 1em);
    z-index: 1;
    float: right;
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
