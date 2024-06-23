<script lang="ts">
  import { fly } from 'svelte/transition';
  import { backInOut } from 'svelte/easing';

  import { RESSOURCES_COLOR, Spell } from '@defferrard/algoo-core/src/game';
  import { objectEntries } from '@defferrard/algoo-core/src/utils/typeCasting';

  import { getCSS, SystemColor } from '../Color';

  import SpellIcon from '$lib/components/game/SpellIcon.svelte';

  export let spell: Spell | undefined;
</script>

{#key spell}
  <resume
    transition:fly={{ x: 200, duration: 500, easing: backInOut }}
    style:--color={getCSS(spell?.color || SystemColor.BODY)}
  >
    {#if spell}
      <icon>
        <SpellIcon {spell} size={6} />
      </icon>
      <info>
        <name>
          {spell.name}
        </name>

        {#each objectEntries(spell.cost) as [key, value]}
          <statsbar
            style:--color={getCSS(RESSOURCES_COLOR[key] || SystemColor.BODY)}
            style:--max-percent={value + 'em'}
          >
            <value>{value} {key}</value>
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
    filter: drop-shadow(0 0 1px black);

    font-size: 2.5vh;
    color: white;
    display: flex;
    flex-direction: row-reverse;
    margin-bottom: 1em;
    position: absolute;
    right: 0;
  }

  icon {
    height: 15vh;
    width: 15vh;
    display: flex;
    justify-content: center;
    align-items: center;
    transform: rotate(15deg);
    border: outset 0.5em white;
    border-radius: 2em;
    overflow: hidden;
    z-index: 1;
  }

  info {
    transform: skew(-15deg);
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.2em;
  }

  name {
    font-size: 1.4em;

    overflow: hidden;
    background-color: black;
    display: block;
    padding: 0 20% 0 15%;

    /* Fit in 1 line */
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  statsbar {
    --max-percent: 0%;
    --display: '';
    margin-right: -0.5em;

    width: calc(var(--max-percent) + 5em);
    background-color: var(--color);
  }

  statsbar:after {
    content: ' ';
    display: inline-block;
  }

  value {
    white-space: nowrap;
    padding-left: 1em;
  }
</style>
