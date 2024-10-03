import { type Writable, writable } from 'svelte/store';

export type fetchStoreResult<DATA, ERROR> = [Writable<DATA>, Writable<boolean>, Writable<ERROR>, () => Promise<void>];
const CACHE: { [key: string]: fetchStoreResult<unknown, unknown> } = {};

function fetchStore<DATA, ERROR>(url: string, init: RequestInit): fetchStoreResult<DATA, ERROR> {
  const loading: Writable<boolean> = writable(false);
  const error: Writable<any> = writable(undefined);
  const data: Writable<any> = writable(undefined);

  async function refresh() {
    loading.set(true);
    error.set(false);
    try {
      console.log('Fetching', url, init);
      const response: Response = await fetch(url, init);
      console.log('Fetched', response);
      data.set(await response.json());
      console.log('Set data', data);
    } catch (e) {
      error.set(e);
    }
    loading.set(false);
  }

  return [data, loading, error, refresh];
}

export default function <DATA, ERROR>(
  url: string,
  init: RequestInit = {},
  cache: boolean = false,
): fetchStoreResult<DATA, ERROR> {
  if (cache && CACHE[url]) {
    return CACHE[url] as fetchStoreResult<DATA, ERROR>;
  }
  const RESULT = fetchStore<DATA, ERROR>(url, init);
  if (cache) {
    CACHE[url] = RESULT;
  }
  return RESULT;
}
