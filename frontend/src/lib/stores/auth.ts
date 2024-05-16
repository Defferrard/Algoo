import { API_BASE_PATH } from '$lib/utils/Const';
import { writable, type Writable } from 'svelte/store';

const BASE_URL = API_BASE_PATH + '/auth';

function login(username: string) {

}

export type authStoreResult = [Writable<any>, Writable<boolean>, Writable<any>, (name: string) => Promise<void>];

export function authStore(): authStoreResult {
  const loading: Writable<boolean> = writable(false);
  const error: Writable<any> = writable(undefined);
  const data: Writable<any> = writable(undefined);

  async function login(name: string) {
    loading.set(true);
    error.set(false);
    try {
      const response: Response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({ name }),
      });
      data.set(await response.json());
    } catch (e) {
      error.set(e);
    }
    loading.set(false);
  }

  return [data, loading, error, login];
}