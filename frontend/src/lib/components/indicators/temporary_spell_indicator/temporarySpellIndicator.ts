import TemporarySpellIndicator from './TemporarySpellIndicator.svelte';
import { Coordinate, type SimpleCoordinate } from '@defferrard/algoo-core/src/board/';
import type { Spell } from '@defferrard/algoo-core/src/game/';
import { notNull } from '@defferrard/algoo-core/src/utils/assertions';

export function showSpell(coordinate: SimpleCoordinate, spell: Spell, duration: number = 1000) {
  const completeCoordinate = new Coordinate(coordinate);
  const tileHTMLElement = notNull(document.getElementById(completeCoordinate.toString()));
  const tileElementRect: DOMRect = tileHTMLElement.getBoundingClientRect();
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
