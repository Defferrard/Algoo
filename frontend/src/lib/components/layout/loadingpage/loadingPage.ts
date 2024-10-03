import {writable} from 'svelte/store';
import type {Writable, Unsubscriber} from 'svelte/store';

export const count = (() => {
    const {subscribe, set, update} = writable(0);

    function increment() {
        update(n => n + 1);
    }

    function decrement() {
        update(n => {
            if(n===0) return 0;
            return n - 1
        });
    }

    return {
        subscribe,
        increment: () => update(n => n + 1),
        decrement: () => update(n => n - 1),
        boundStore: (store: Writable<boolean>): Unsubscriber =>
            store.subscribe((value:boolean) => {
                if (value) increment();
                else decrement();
            })

    };
})();