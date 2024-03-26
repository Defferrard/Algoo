import { writable } from 'svelte/store';

export const count = (() => {
    const {subscribe, set, update} = writable(0);

    return {
        subscribe,
        increment: () => update(n => n + 1),
        decrement: () => update(n => n - 1),
    };
})();