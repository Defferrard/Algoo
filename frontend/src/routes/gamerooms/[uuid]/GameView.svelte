<script async lang="ts">
  import { getCompleteHero } from '$lib/beans/heroes';

  import { ActionBar, BoardComponent, HeroResume, SpellResume, TimerProgressBar } from '$lib/components/';
  import { display, movementCost } from '$lib/components/indicators/movement_cost_indicator';
  import KeyBoardListener from '$lib/components/KeyBoardListener.svelte';
  import { delay } from '$lib/utils/Functions';

  import { Coordinate, Entity, TileType } from '@defferrard/algoo-core/src/board/';
  import type { Resources } from '@defferrard/algoo-core/src/game/';
  import { Color, HeroEntity, ResourceType, Spell, Team } from '@defferrard/algoo-core/src/game/';
  import { notUndefined } from '@defferrard/algoo-core/src/utils/assertions';
  import { findPath, getAccessibles, getVisibles } from '@defferrard/algoo-core/src/pathfinding';
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';
  import type { GameManagerDTO } from '@defferrard/algoo-core/src/dto';
  import { create } from './GameManagerBuilder';
  import { isHeroEntity } from '@defferrard/algoo-core/src/game/hero/HeroEntity';

  export let gameManagerDTO: GameManagerDTO;
  const { model, viewController: controller } = create(gameManagerDTO);

  let targetEntity: Entity<Resources> | undefined;
  let targetHero: HeroEntity | undefined;
  let currentSpell: Spell | undefined;

  let path: Coordinate[] = []; // The path the current hero will take
  let visibles: Coordinate[] = []; // Tiles visible by the current hero
  let markers: Coordinate[] = []; // Tiles marked by the user
  let accessible: Coordinate[] = []; // Tiles where the current hero can move
  let targetable: Coordinate[] = []; // Tiles where the current spell can be cast
  let attacked: Coordinate[] = [];

  let active: Coordinate | undefined; // The tile the mouse is hovering
  let lastHover: Coordinate | undefined; // The last tile the mouse was hovering

  $: if (model.gameManager && model.gameManager.currentHero) {
    const gameManager = model.gameManager;
    const currentHero = notUndefined(gameManager.currentHero);
    visibles = getVisibles(
      currentHero.team!.entities.map((entity: Entity<Resources>) => gameManager.board.getEntityCoordinate(entity)),
      model.gameManager.board,
    );

    if (controller.isBusy) {
      accessible = [];
      targetable = [];
      attacked = [];
    } else if (currentSpell) {
      accessible = [];
      targetable = currentSpell.targetableTiles(
        gameManager.board.getEntityCoordinate(gameManager.currentHero!),
        gameManager.board,
        visibles,
      );
    } else {
      targetable = [];
      attacked = [];
      accessible = getAccessibles(
        gameManager.board.getEntityCoordinate(gameManager.currentHero!),
        gameManager.currentHero!.resources[ResourceType.STAMINA]!,
        gameManager.board,
        visibles,
      );
    }

    if (
      active &&
      !active.equals(gameManager.board.getEntityCoordinate(currentHero)) &&
      accessible.some((c: Coordinate) => c.equals(active as Coordinate))
    ) {
      if (!path[path.length - 1]?.isNeighbor(gameManager.board.getEntityCoordinate(currentHero))) {
        path = findPath(gameManager.board.getEntityCoordinate(currentHero), active, gameManager.board, accessible);
      } else if (path.some((c: Coordinate) => c.equals(active as Coordinate))) {
        // If the path makes a loop, cut it to the active tile
        while (!path[0].equals(active)) {
          path.shift();
        }
      } else if (
        path.length > 0 &&
        active.neighbors.some((n) => n.equals(path[0])) &&
        gameManager.board.getPathCost(path) + gameManager.board.getTile(active).movementCost! <=
          currentHero.resources[ResourceType.STAMINA]
      ) {
        // If the active tile is simply a neighbor of the first tile of the path, add it to the path
        path = [active, ...path];
      } else {
        // Otherwise, find the new shortest path
        path = findPath(
          model.gameManager.board.getEntityCoordinate(gameManager.currentHero!),
          active,
          model.gameManager.board,
          accessible,
        );
      }
      movementCost.set(model.gameManager.board.getPathCost(path));

      display.set(path.length > 0);
    } else if (active && targetable.some((c: Coordinate) => c.equals(active as Coordinate))) {
      path = [];
      attacked =
        currentSpell?.attackedTiles(
          model.gameManager.board.getEntityCoordinate(gameManager.currentHero!),
          active,
          model.gameManager.board,
        ) || [];
      movementCost.set(0);
      display.set(false);
    } else {
      active = undefined;
      attacked = [];
      path = [];
      movementCost.set(0);
      display.set(false);
    }
  }

  function nextTurn() {
    currentSpell = undefined;
    model.nextTurn();
  }

  function hover(x: number, y: number) {
    lastHover = new Coordinate({ x, y });
    clearHover();
    if (
      model.gameManager.board.getTile({ x, y }).type !== TileType.Wall &&
      (accessible.some((c: Coordinate) => c.equals(new Coordinate({ x, y }))) ||
        targetable.some((c: Coordinate) =>
          c.equals(
            new Coordinate({
              x,
              y,
            }),
          ),
        ))
    ) {
      active = new Coordinate({ x, y });
    }
  }

  function clearHover() {
    active = undefined;
  }

  function onAction(x: number, y: number) {
    if (!active) {
      return;
    } else if (currentSpell) {
      model.gameManager.castSpell(currentSpell, new Coordinate({ x, y }));
      currentSpell = undefined;
    } else if (model.gameManager.currentHero) {
      model.gameManager.moveEntity(model.gameManager.currentHero, path);
    }
  }

  async function mark(x: number, y: number) {
    const coordinate: Coordinate = new Coordinate({ x, y });
    markers = [...markers, coordinate];
    await delay(5000);
    markers = markers.filter((c: Coordinate) => !c.equals(coordinate));
  }

  function previewSpell(index: number) {
    const currentHero = notUndefined(model.gameManager.currentHero);
    if (!isHeroEntity(currentHero)) {
      return;
    }

    const spell = currentHero.spells[index];
    if (
      !spell || // if no spell is provided, cancel it
      currentSpell === spell || // if already previewing the spell, cancel it
      !currentHero.spells.includes(spell) || // If the hero doesn't have the spell, cancel it
      !currentHero.has(spell.cost)
    ) {
      // if the hero doesn't have enough resources, cancel it
      currentSpell = undefined;
    } else {
      active = lastHover;
      currentSpell = spell;
    }
  }

  onMount(async () => {
    const TEAM_1 = new Team(Color.RED, 'Team 1');
    const TEAM_2 = new Team(Color.BLUE, 'Team 2');

    model.pushTeam(TEAM_1);
    model.pushTeam(TEAM_2);

    const HERO_1 = new HeroEntity(await getCompleteHero('armony'));
    const HERO_2 = new HeroEntity(await getCompleteHero('outrage'));
    const HERO_3 = new HeroEntity(await getCompleteHero('armony'));

    HERO_1.team = TEAM_1;
    HERO_2.team = TEAM_2;
    HERO_3.team = TEAM_2;

    model.pushEntity(HERO_1, new Coordinate({ x: 0, y: 0 }));
    model.pushEntity(HERO_2, new Coordinate({ x: 1, y: 0 }));
    // GAME_MANAGER.pushEntity(HERO_3, new Coordinate({x: 13, y: 12}));
  });
</script>

<KeyBoardListener on:space={nextTurn} on:digit={(event) => previewSpell(event.detail.digit - 1)} />

<!--TODO : Better title management-->
<svelte:head>
  <title>
    {model.gameManager.currentHero?.name}'s turn !
  </title>
</svelte:head>

<svelte:document style:backdrop-filter="blur(10px)" />

<section in:fly={{ delay: 200 }} out:fly={{ duration: 200 }}>
  <board>
    <BoardComponent
      {...{
        board: $model.gameManager.board,
        path,
        active,
        accessible,
        visibles,
        markers,
        targetable,
        attacked,
      }}
      on:click={(event) => onAction(event.detail.x, event.detail.y)}
      on:rightclick={(event) => {
        mark(event.detail.x, event.detail.y);
      }}
      on:hovertile={(event) => hover(event.detail.x, event.detail.y)}
      on:exit={() => {
        clearHover();
        lastHover = undefined;
      }}
      on:mouseenterentity={(event) => {
        targetEntity = event.detail;
        if (isHeroEntity(targetEntity)) {
          targetHero = targetEntity;
        }
      }}
      on:mouseleaveentity={() => {
        targetEntity = undefined;
        targetHero = undefined;
      }}
    />
  </board>

  <heroResume>
    <HeroResume hero={targetHero} stickRight />
  </heroResume>
  <spellResume>
    <SpellResume spell={currentSpell} />
  </spellResume>

  <bottom>
    {#if $model.gameManager.currentHero}
      <ActionBar
        hero={$model.gameManager.currentHero}
        spellPreview={currentSpell}
        on:spellaction={(event) => {
          previewSpell(event.detail.spell);
        }}
        on:endturn={() => nextTurn()}
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
