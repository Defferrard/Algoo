<script async lang="ts">
  import { ActionBar, BoardComponent, HeroResume, SpellResume, TimerProgressBar } from '$lib/components/';
  import KeyBoardListener from '$lib/components/KeyBoardListener.svelte';

  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';
  import type { GameManagerDTO } from '@defferrard/algoo-core/src/dto';
  import { create } from './GameManagerBuilder';
  import { getCompleteHero } from '$lib/beans/heroes';
  import { HeroEntity } from '@defferrard/algoo-core/src/game';

  export let gameManagerDTO: GameManagerDTO;
  const { model, viewModel } = create(gameManagerDTO);
  const { currentSpell, targetHero, currentHero, markers } = viewModel.stores;

  onMount(async () => {
    const HERO_1 = new HeroEntity(await getCompleteHero('armony'));
    console.log(HERO_1.spells[0].iconPath);
  });
</script>

<KeyBoardListener
  on:space={() => viewModel.nextTurn()}
  on:digit={(event) => viewModel.previewSpell(event.detail.digit - 1)}
/>

<!--TODO : Better title management-->
<svelte:head>
  <title>
    {$model.gameManager.currentHero?.name}'s turn !
  </title>
</svelte:head>

<svelte:document style:backdrop-filter="blur(10px)" />
<section in:fly={{ delay: 200 }} out:fly={{ duration: 200 }}>
  <board>
    <BoardComponent
      {...{
        board: $model.gameManager.board,
        path: $model.path,
        active: $model.active,
        accessible: $model.accessible,
        visibles: $model.visibles,
        markers: $markers,
        targetable: $model.targetable,
        attacked: $model.attacked,
      }}
      on:click={(event) => viewModel.onAction(event.detail.x, event.detail.y)}
      on:rightclick={(event) => viewModel.mark(event.detail.x, event.detail.y)}
      on:hovertile={(event) => viewModel.hover(event.detail.x, event.detail.y)}
      on:exit={() => viewModel.clearHover()}
      on:mouseenterentity={(event) => viewModel.hoverEntity(event.detail)}
      on:mouseleaveentity={() => viewModel.hoverEntity()}
    />
  </board>

  <heroResume>
    <HeroResume hero={$targetHero} stickRight />
  </heroResume>
  <spellResume>
    <SpellResume spell={$currentSpell} />
  </spellResume>

  <bottom>
    {#if $currentHero}
      <ActionBar
        hero={$currentHero}
        spellPreview={$currentSpell}
        on:spellaction={(event) => viewModel.previewSpell(event.detail.spell)}
        on:endturn={() => viewModel.nextTurn()}
      />
      <!--            <TimerProgressBar percentage={gameManager.gameTimer.percentage}/>-->
      <TimerProgressBar percentage={50} />
    {/if}
  </bottom>
</section>

<style>
  section {
    height: 100vh;
    display: block;
    background: linear-gradient(180deg, transparent 0%, var(--color-theme) 100%);
    backdrop-filter: blur(0.5em);
  }

  board {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80vh;
    width: 100vw;
  }

  heroResume,
  spellResume {
    position: absolute;
    right: 2vw;
  }

  heroResume {
    top: 10vh;
  }

  spellResume {
    top: 30vh;
  }

  bottom {
    position: absolute;
    bottom: 3vh;
    width: 100vw;
  }
</style>
