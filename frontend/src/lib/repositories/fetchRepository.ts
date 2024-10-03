import type { fetchStoreResult } from '$lib/stores';
import { DTO } from '@defferrard/algoo-core/src/dto';

export type fetchRepository<D extends DTO, ID = unknown> = {
  getAll: () => fetchStoreResult<D[], unknown>;
  get: (ID: any) => fetchStoreResult<D, unknown>;
  create: (body: D) => fetchStoreResult<D, unknown>;
  update: (ID: any, body: Partial<D>) => fetchStoreResult<D, unknown>;
  delete: (ID: any) => fetchStoreResult<D, unknown>;
};
