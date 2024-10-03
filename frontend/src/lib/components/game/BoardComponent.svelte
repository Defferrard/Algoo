<script lang="ts">
  import { createEventDispatcher, onDestroy } from 'svelte';

  import { Coordinate, TileType, Board, type SimpleCoordinate } from '@defferrard/algoo-core/src/board/';

  import { movementCostIndicator } from '../indicators/movement_cost_indicator/';
  import HeroComponent from './HeroComponent.svelte';

  import { shakeable } from '$lib/animations/shake';
  import mousePosition from '$lib/utils/store/mousePosition';

  const dispatch = createEventDispatcher();

  export let board: Board;
  export let visibles: SimpleCoordinate[] = [];
  export let attacked: SimpleCoordinate[] = [];
  export let markers: SimpleCoordinate[] = [];
  export let accessible: SimpleCoordinate[] = [];
  export let targetable: SimpleCoordinate[] = [];
  export let path: SimpleCoordinate[] = [];
  export let active: SimpleCoordinate | undefined = undefined;

  const rotateFactor = 2;
  const defaultYRotation = 25;

  let boardHTMLElement: HTMLElement;
  let boardRotation: Coordinate = new Coordinate({
    x: 0,
    y: -defaultYRotation,
  });
  const unsubscribe = mousePosition.subscribe((value: Coordinate) => {
    if (!boardHTMLElement) return;
    const rect: DOMRect = boardHTMLElement.getBoundingClientRect();
    let scelleraPosition: Coordinate = new Coordinate({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });
    boardRotation = value.minus(scelleraPosition);
    boardRotation = new Coordinate({
      x: (boardRotation.x / rect.width) * rotateFactor,
      y: (boardRotation.y / rect.height) * rotateFactor - defaultYRotation,
    });
  });

  onDestroy(() => {
    unsubscribe();
  });
</script>

<section use:shakeable>
  <!--  BACKGROUND TABLE FOR PERSPECTIVE  -->
  <table
    style:--look-at-x={-boardRotation.y + 'deg'}
    style:--look-at-y={boardRotation.x + 'deg'}
    style:--width={board.width + 'em'}
  >
    {#each { length: board.height } as _, y}
      <tr>
        {#each { length: board.width } as _, x}
          <td
            class:path={path.some((otherCoordinate) => Coordinate.equals(otherCoordinate, { x, y }))}
            class:fog={!visibles.some((otherCoordinate) => Coordinate.equals(otherCoordinate, { x, y }))}
            class:wall={board.getTile({ x, y }).type === TileType.Wall}
            class:accessible={accessible.some((otherCoordinate) => Coordinate.equals(otherCoordinate, { x, y }))}
            class:targetable={targetable.some((otherCoordinate) => Coordinate.equals(otherCoordinate, { x, y }))}
            class:attacked={attacked.some((otherCoordinate) => Coordinate.equals(otherCoordinate, { x, y }))}
          >
          </td>
        {/each}
      </tr>
    {/each}
  </table>

  <!--  MAIN TABLE  -->

  <table
    on:mouseleave={() => dispatch('exit')}
    bind:this={boardHTMLElement}
    style:--look-at-x={-boardRotation.y + 'deg'}
    style:--look-at-y={boardRotation.x + 'deg'}
    style:--width={board.width + 'em'}
  >
    {#each { length: board.height } as _, y}
      <tr>
        {#each { length: board.width } as _, x}
          <td
            id={`(${x};${y})`}
            class:path={path.some((otherCoordinate) => Coordinate.equals(otherCoordinate, { x, y }))}
            class:fog={!visibles.some((otherCoordinate) => Coordinate.equals(otherCoordinate, { x, y }))}
            class:wall={board.getTile({ x, y }).type === TileType.Wall}
            class:accessible={accessible.some((otherCoordinate) => Coordinate.equals(otherCoordinate, { x, y }))}
            class:targetable={targetable.some((otherCoordinate) => Coordinate.equals(otherCoordinate, { x, y }))}
            class:attacked={attacked.some((otherCoordinate) => Coordinate.equals(otherCoordinate, { x, y }))}
            class:active={Coordinate.equals(active, { x, y })}
            class:marker={markers.some((otherCoordinate) => Coordinate.equals(otherCoordinate, { x, y }))}
            on:click={(event) => {
              if (board.getTile({ x, y }).type === TileType.Wall) {
                return;
              } else if (Coordinate.equals(active, { x, y })) {
                event.stopPropagation();
              }
              dispatch('click', { x, y });
            }}
            on:mouseenter={() => dispatch('hovertile', { x, y })}
            on:contextmenu|preventDefault={() => dispatch('rightclick', { x, y })}
            use:movementCostIndicator
          >
            {#if visibles.some( (otherCoordinate) => Coordinate.equals( otherCoordinate, { x, y }, ), ) && board.getTile( { x, y }, ).entity}
              <HeroComponent
                lookAt={$mousePosition}
                on:mouseenter={() => {
                  dispatch('mouseenterentity', board.getTile({ x, y }).entity);
                }}
                on:mouseleave={() => {
                  dispatch('mouseleaveentity', board.getTile({ x, y }).entity);
                }}
                key={board.getTile({ x, y }).entity.uuid}
                hero={board.getTile({ x, y }).entity}
              />
            {/if}
          </td>
        {/each}
      </tr>
    {/each}
  </table>
</section>

<style>
  section {
    --color-table-shadow: color-mix(in srgb, var(--color), black 90%);
    position: relative;
    height: 100%;
    width: 100%;
    filter: drop-shadow(0 0 1px var(--color-table-shadow));
  }

  table {
    --width: 0;
    --border-radius: 0.2em;
    --look-at-x: 0deg;
    --look-at-y: 0deg;
    transform: rotateX(var(--look-at-x)) rotateY(var(--look-at-y));
    display: block;
    position: absolute;
    border-collapse: collapse;
    table-layout: fixed;
    width: var(--width);
    left: calc(50% - var(--width) / 2);
    top: 15%;
    font-size: 4vh;
  }

  table:nth-child(1) {
    /*BACKGROUND TABLE*/
    transform: rotateX(var(--look-at-x)) rotateY(var(--look-at-y)) translateZ(-1em);
    filter: brightness(0.4);
  }

  tr:nth-of-type(even) td:nth-of-type(even),
  tr:nth-of-type(odd) td:nth-of-type(odd) {
    --base-color: color-mix(in srgb, var(--color), white 80%);
  }

  td {
    --base-color: color-mix(in srgb, var(--color), white 90%);
    --mix-color: #fff;
    --percent: 0%;
    padding: 0;
    height: 1em;
    width: 1em;
    text-align: center;
    background-color: color-mix(in srgb, var(--base-color), var(--mix-color) var(--percent));

    outline: 0.2em solid transparent;
    outline-offset: -1px;
    overflow: visible;
  }

  td.accessible,
  td.targetable,
  td.attacked {
    --percent: 50%;
  }

  td.fog {
    --percent: 85%;
    --darker-color: color-mix(in srgb, var(--mix-color), black var(--percent));
    background-color: color-mix(in srgb, var(--base-color), var(--darker-color) var(--percent));
  }

  td.accessible {
    --mix-color: var(--color-green);
  }

  td.path {
    --percent: 80%;
  }

  td.targetable {
    --mix-color: var(--color-orange);
  }

  td.attacked {
    --mix-color: var(--color-red);
  }

  td.wall {
    background-color: transparent;
  }

  td.active {
    --outline-color: white;
    --percent: 100%;
    outline: 0.2em solid var(--outline-color);
    border-radius: 0.1em;
    transform: rotate(5deg) scale(1.2);
    cursor: pointer;

    position: relative;
    z-index: 1;
    transition-delay: 0.1s;
  }

  td.marker {
    animation-name: markerBlinking;
    animation-duration: 1s;
    animation-iteration-count: infinite;
  }

  @keyframes markerBlinking {
    0% {
      box-shadow: inset 0 0 0.6em 0.1em var(--color);
      filter: brightness(0.8);
    }
    50% {
      box-shadow: inset 0 0 0.4em 0 var(--color);
      filter: brightness(1.2);
    }
    100% {
      box-shadow: inset 0 0 0.6em 0.1em var(--color);
      filter: brightness(0.8);
    }
  }

  /* td of the coin top left */
  tr:first-child > td:first-child {
    border-top-left-radius: var(--border-radius);
  }

  /* td of the coin top right */
  tr:first-child > td:last-child {
    border-top-right-radius: var(--border-radius);
  }

  /* td of the coin bottom left */
  tr:last-child > td:first-child {
    border-bottom-left-radius: var(--border-radius);
  }

  /* td of the coin bottom right */
  tr:last-child > td:last-child {
    border-bottom-right-radius: var(--border-radius);
  }
</style>
