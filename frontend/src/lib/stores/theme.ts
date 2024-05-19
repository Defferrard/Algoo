import { get as getValue, store as storeValue } from '$lib/stores/localStorage';
import { Theme } from '$lib/utils/Theme';
import { get, writable } from 'svelte/store';


const LOCALSTORAGE_KEY: string = 'theme';

export const theme = (() => {
  const STORED = getValue(LOCALSTORAGE_KEY);
  const THEME: Theme = STORED ?? Theme.SYSTEM; // If there is a stored theme
  // (window.matchMedia &&
  // window.matchMedia('(prefers-color-scheme: dark)').matches // If the device is using dark mode
  //   ? Theme.DARK
  //   : Theme.LIGHT);
  const store = writable(THEME);
  const { subscribe, set, update } = store;
  storeValue(LOCALSTORAGE_KEY, { subscribe });

  return {
    subscribe,
    swap: () => {
      update((theme: Theme) => {
        document.documentElement.classList.remove(theme);
        const nbThemes: number = Object.values(Theme).length;
        const index: number = Object.values(Theme).indexOf(theme);
        const newTheme: Theme = Object.values(Theme)[
          (index + 1) % nbThemes
        ] as Theme;
        document.documentElement.classList.add(newTheme);
        return newTheme;
      });
    },
    apply: () => {
      document.documentElement.classList.remove(...Object.values(Theme));

      document.documentElement.classList.add(get(store));
    },
  };
})();
