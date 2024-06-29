import TemporarySpellIndicator from './TemporarySpellIndicator.svelte';
import type { SimpleCoordinate } from '@defferrard/algoo-core/src/board/';
import type { Spell } from '@defferrard/algoo-core/src/game/';

export function showSpell(coordinate: SimpleCoordinate, spell: Spell, duration: number = 1000) {
  const tileElementRect: DOMRect = document.getElementById(coordinate.toString())!.getBoundingClientRect();
  let component = new TemporarySpellIndicator({
    props: {
      x: tileElementRect.left,
      y: tileElementRect.top,
      spell,
      duration,
    },
    target: document.body,
  });
  setTimeout(() => {
    component.$set({
      visible: false,
    } as any);
    setTimeout(() => {
      component.$destroy();
    }, duration / 2);
  }, duration / 2);
}
