import { get as getValue, store as storeValue } from '$lib/stores/localStorage';
import { socket } from '$lib/stores/socket';
import { UserDTO } from '@defferrard/algoo-core/src/dto';
import { User } from '@defferrard/algoo-core/src/socket';
import type { Type } from '@defferrard/algoo-core/src/utils/Type';
import { faker } from '@faker-js/faker';
import { get, writable } from 'svelte/store';
import { v4 as uuidV4 } from 'uuid';

const UUID: string = uuidV4();
const LOCALSTORAGE_KEY = 'user';

export const localUser = (() => {
  const STORED = getValue(LOCALSTORAGE_KEY) as Type<UserDTO>;
  const USER: User = STORED?.name ? new User(STORED) : new User({ uuid: UUID, name: faker.internet.userName() });
  const { subscribe, set, update } = writable(USER);
  storeValue(LOCALSTORAGE_KEY, { subscribe });

  return {
    subscribe,
    set: (user: User) => {
      if (get(socket)?.connected) throw new Error('Cannot change user while connected');
      set(user);
    },
    setUsername: (name: string) => {
      update((user) => {
        user.name = name;
        return user;
      });
    },
  };
})();
