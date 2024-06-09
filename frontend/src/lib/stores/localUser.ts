import { get as getValue, store as storeValue } from '$lib/stores/localStorage';
import { socket } from '$lib/stores/socket';
import { User } from '@defferrard/algoo-core/src/socket';
import { faker } from '@faker-js/faker';
import { get, writable } from 'svelte/store';
import { v4 as uuidV4 } from 'uuid';

const UUID: string = uuidV4();
const LOCALSTORAGE_KEY = 'user';

export const localUser = (() => {
  const STORED = getValue(LOCALSTORAGE_KEY);
  const USER: User = STORED ? new User(STORED.uuid, STORED.name) : new User(UUID, faker.internet.userName());
  const { subscribe, set, update } = writable(USER);
  storeValue(LOCALSTORAGE_KEY, { subscribe });

  return {
    subscribe,
    set: (user: User) => {
      if (get(socket)?.connected) throw new Error('Cannot change user while connected');
      set(user);
    },
    setUsername: (name: string) => {
      update(user => {
        user.name = name;
        return user;
      });
    },
  };
})();