<script lang="ts">
  import { HeroEntity } from '@defferrard/algoo-core/src/game';
  import { Coordinate } from '@defferrard/algoo-core/src/board/';

  import { receive, send } from '$lib/animations/translate';
  import getHeroes from '$lib/assets/heroes';
  import { getCSS } from '../Color';
  import { notUndefined } from '@defferrard/algoo-core/src/utils/assertions';

  export let hero: HeroEntity;
  export let lookAt: Coordinate = new Coordinate({ x: 0, y: 0 });
  export let dropShadow: boolean = false;
  export let key: unknown = undefined;
  let simplifiedLookAt: Coordinate = new Coordinate({ x: 0, y: 0 });

  let front: unknown;
  let base: unknown;
  getHeroes(hero.name).then((hero) => {
    front = hero.front;
    base = hero.base;
  });

  let uuid = hero.uuid;
  $: if (hero) {
    uuid = hero.uuid;
  }

  let scellera: HTMLElement;
  $: if (scellera) {
    const rect: DOMRect = scellera.getBoundingClientRect();
    let scelleraPosition: Coordinate = new Coordinate({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });
    simplifiedLookAt = lookAt.minus(scelleraPosition);
    simplifiedLookAt = new Coordinate({
      x: simplifiedLookAt.x / rect.width,
      y: simplifiedLookAt.y / rect.height,
    });
    if (simplifiedLookAt.getLength() > 1) simplifiedLookAt = simplifiedLookAt.normalized();
  }

  function _receive(node: HTMLElement, ...args: unknown[]) {
    return receive(node, { key, ...args });
  }

  function _send(node: HTMLElement, ...args: unknown[]) {
    return send(node, { key, ...args });
  }
</script>

<!-- ARIA Role : IMG -->
<hero
  class={hero.stance}
  class:drop-shadow={dropShadow}
  role="img"
  on:mouseenter
  on:mouseleave
  style:--team-color={getCSS(notUndefined(hero.team).color)}
>
  <div in:_receive out:_send>
    {#if base}
      <sprite style:mask-image="url({base})"></sprite>
    {/if}

    <scellera
      style:--look-at-x={simplifiedLookAt.x}
      style:--look-at-y={simplifiedLookAt.y}
      style:animation-delay={Math.random() * 10 + 's'}
      bind:this={scellera}
    >
      <pupil> </pupil>
    </scellera>

    {#if front}
      <sprite style:mask-image="url({front})"></sprite>
    {/if}
  </div>
</hero>

<style>
  sprite {
    pointer-events: none;
    background-color: var(--team-color);
    position: absolute;
    --sprite-size: calc(var(--size) * 3);
    -webkit-mask-size: var(--sprite-size);
    mask-size: var(--sprite-size);
    width: var(--sprite-size);
    height: var(--sprite-size);
    top: calc(50% - 0.5 * var(--sprite-size));
    left: calc(50% - 0.5 * var(--sprite-size));
  }

  hero {
    --team-color: black;
    overflow: visible;
    position: relative;
    width: 100%;
    height: 100%;
  }

  hero.drop-shadow {
    filter: drop-shadow(0 0 1px black);
  }

  div {
    --size: 1em;
    border-radius: 100%;
    width: var(--size);
    height: var(--size);
    top: calc(50% - 0.5 * var(--size));
    left: calc(50% - 0.5 * var(--size));
    position: relative;
  }

  scellera {
    --margin: 0.05em;
    --factor-margin: 2.5;
    --look-at-x: 0;
    --look-at-y: 0;
    --size: calc(100% - var(--factor-margin) * 2 * var(--margin));
    border-radius: 100%;
    background-color: white;

    position: absolute;
    left: calc(var(--margin) * var(--factor-margin));
    top: calc(var(--margin) * var(--factor-margin));
    translate: calc(var(--look-at-x) * var(--margin)) calc(var(--look-at-y) * var(--margin));

    width: var(--size);
    height: var(--size);

    overflow: hidden;
    animation: close_eye 10s infinite;
  }

  pupil {
    border-radius: 100%;
    background-color: var(--team-color);
    --size: calc(100% - var(--factor-margin) * 2 * var(--margin));
    --margin: 0.04em;
    --factor-margin: 2.5;

    position: absolute;
    left: calc(var(--margin) * var(--factor-margin));
    top: calc(var(--margin) * var(--factor-margin));
    translate: calc(var(--look-at-x) * var(--margin)) calc(var(--look-at-y) * var(--margin));

    width: var(--size);
    height: var(--size);
  }

  @keyframes close_eye {
    0%,
    49%,
    51%,
    100% {
      transform: scaleY(1);
    }
    50% {
      transform: scaleY(0);
    }
  }
</style>
