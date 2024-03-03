import {type Writable, writable} from 'svelte/store';

export type fetchStoreResult = [Writable<any>, Writable<boolean>, Writable<any>, () => Promise<void>];
const CACHE: { [key: string]: fetchStoreResult } = {};

function fetchStore(url: string, init: RequestInit): fetchStoreResult {
    const loading: Writable<boolean> = writable(false)
    const error: Writable<any> = writable(undefined)
    const data: Writable<any> = writable(undefined)

    async function refresh() {
        loading.set(true)
        error.set(false)
        try {
            const response: Response = await fetch(url, init)
            data.set(await response.json())
        } catch (e) {
            error.set(e)
        }
        loading.set(false)
    }

    refresh().then();

    return [data, loading, error, refresh]
}

export default function (url: string, init: RequestInit = {}, cache: boolean = false): fetchStoreResult {
    if (cache && CACHE[url]) return CACHE[url];
    const RESULT: fetchStoreResult = fetchStore(url, init);
    if (cache) CACHE[url] = RESULT;
    return RESULT;
}