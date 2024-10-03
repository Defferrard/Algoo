import type { Readable } from 'svelte/store';

export function store(key: string, store: Readable<any>): boolean {
  if (typeof window !== 'undefined') {
    store.subscribe((value) => {
      localStorage.setItem(key, JSON.stringify(value));
    });
    return true;
  }
  return false;
}

export function get(key: string) {
  if (typeof window !== 'undefined') {
    return JSON.parse(localStorage.getItem(key)!);
  } else {
    return undefined;
  }
}
