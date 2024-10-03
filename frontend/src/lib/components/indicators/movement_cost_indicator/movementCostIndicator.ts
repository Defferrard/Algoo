import MovementCostIndicator from './MovementCostIndicator.svelte';
import type { ActionReturn } from 'svelte/action';
import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

export const movementCost: Writable<number> = writable(0);
let component: MovementCostIndicator;

export const display: Writable<boolean> = writable(false);

export function movementCostIndicator(element: HTMLElement): ActionReturn {
  if (!component) {
    component = new MovementCostIndicator({
      props: {
        x: 0,
        y: 0,
      },
      target: document.body,
    });
  }

  function mouseOver(event: any) {
    const rect = element.getBoundingClientRect();
    component.$set({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });
  }

  element.addEventListener('mouseover', mouseOver);

  return {
    destroy() {
      element.removeEventListener('mouseover', mouseOver);
    },
  };
}
