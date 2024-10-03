import { fetchStore } from '$lib/stores';
import { API_BASE_PATH } from '$lib/utils/Const';
import { SimpleGameRoomDTO } from '@defferrard/algoo-core/src/dto/SimpleGameRoomDTO';

const BASE_URL = API_BASE_PATH + '/rooms';

export const GAME_ROOM_REPOSITORY = {
  store: {
    getAll: () => fetchStore<SimpleGameRoomDTO[], unknown>(BASE_URL),
  },
  request: {
    create: async (name: string) =>
      fetch(BASE_URL, {
        method: 'POST',
        body: JSON.stringify({ name }),
      }),
  },
};
