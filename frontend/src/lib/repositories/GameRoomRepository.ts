import type { fetchStoreResult } from '$lib/stores';
import { fetchStore } from '$lib/stores';
import { API_BASE_PATH } from '$lib/utils/Const';

const BASE_URL = API_BASE_PATH + '/rooms';

export const GAME_ROOM_REPOSITORY = {
  store: {
    getAll: (): fetchStoreResult => fetchStore(BASE_URL),
  },
  request: {
    create: async (name: string) => fetch(BASE_URL, {
      method: 'POST',
      body: JSON.stringify({ name }),
    }),
  },
};