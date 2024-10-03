import { API_BASE_PATH } from '$lib/utils/Const';
import { type Writable, writable } from 'svelte/store';

const BASE_URL = API_BASE_PATH + '/auth';

export function authStore() {
  const loading: Writable<boolean> = writable(false);
  const error: Writable<unknown> = writable(undefined);
  const data: Writable<string | undefined> = writable(undefined);

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

  return [data, loading, error, login] as const;
}
