import {get, writable} from "svelte/store";
import type {Readable, Writable} from "svelte/store";
import type {Unsubscriber} from "svelte/src/runtime/store/public";
import {mapRArray, setValueRArray, getValueRArray} from "$lib/utils/RArray";
import type {RArray} from "$lib/utils/RArray";


export interface Observer<T> extends Readable<T> {
    /**
     * Set Store to observe and inform subscribers.
     * @param newStore to set
     */
    set(this: void, newStore: Writable<T>): void;
}

export interface ArrayObserver<T extends RArray<any>> extends Readable<T> {
    /**
     * Set Store to observe and inform subscribers.
     * @param newStore to set
     * @param index of the array to set
     */
    set(this: void, newStore: Writable<any>, index: number[]): void;
}


export function observer<T>(store ?: Writable<T>): Observer<T> {
    const localStore: Writable<T> = writable();
    let unsubscribe: Unsubscriber = () => {
    };
    if (store) {
        unsubscribe = setStore(localStore, store!);
    }

    return {
        subscribe: localStore.subscribe,
        set: (newStore: Writable<T>) => {
            unsubscribe(); // Unsubscribe from old store
            unsubscribe = setStore(localStore, newStore); // Subscribe to new store
        }
    }
}

// TODO : We may optimize this !!
export function arrayObserver<T>(stores: RArray<Writable<T>>): ArrayObserver<RArray<T>> {
    const localStore: Writable<RArray<T>> = writable(
        mapRArray(stores, (store: Writable<T>, index: number[]) => {
            return undefined
        })
    ) as any;

    let unsubscribes: RArray<Unsubscriber> = mapRArray(stores, (store: Writable<T>, index: number[]) => {
        return () => {
        };
    });

    mapRArray(stores, (store: Writable<T>, index: number[]) => {
        // Subscribe to all stores
        const unsubscribe: Unsubscriber = setArrayStore(localStore, store, index);
        setValueRArray(unsubscribes, unsubscribe, index);
    });

    return {
        subscribe: localStore.subscribe,
        set: (newStore: Writable<T>, index: number[]) => {
            getValueRArray(unsubscribes, index)(); // Unsubscribe from old store
            setValueRArray(unsubscribes, setArrayStore(localStore, newStore, index), index);
        }
    }
}

function setStore<T>(localStore: Writable<T>, newStore: Writable<T>): Unsubscriber {
    localStore.set(get(newStore));
    if(!newStore) return () => {};
    return newStore.subscribe((value: T) => {
        localStore.set(value);
    });
}

function setArrayStore<T>(localStore: Writable<RArray<T>>,
                          newStore: Writable<T>,
                          index: number[]): Unsubscriber {
    // Set initial value from all stores
    updateArrayLocalStore(localStore, get(newStore), index);

    if(!newStore) return () => {};

    // Subscribe to all stores
    return newStore.subscribe((value: T) => {
        updateArrayLocalStore(localStore, value, index);
    })
}

function updateArrayLocalStore<T>(localStore: Writable<RArray<T>>, value: T, index: number[]) {
    localStore.update((localArray: RArray<T>) => {
        setValueRArray(localArray, value, index);
        return localArray;
    });
}

