import type {fetchStoreResult} from "$lib/stores";

export type fetchRepository = {
    getAll: () => fetchStoreResult;
    get: (id: any) => fetchStoreResult;
    create: (body: any) => fetchStoreResult;
    update: (id: any, body: any) => fetchStoreResult;
    delete: (id: any) => fetchStoreResult;
}