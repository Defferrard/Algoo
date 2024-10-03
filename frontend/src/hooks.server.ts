import type {RequestEvent} from "@sveltejs/kit";
import {LOGGER} from "$lib/utils/Logger.server";

export async function handle({event, resolve}: { event: RequestEvent; resolve: any }): Promise<Response> {
    LOGGER.info(`${event.request.method} ${event.url.pathname}`);
    return resolve(event);
}

/** @type {import('@sveltejs/kit').HandleFetch} */
export async function handleFetch({request, fetch}: any) {
    LOGGER.info(`FETCH ${request.method} ${request.url}`);
    return fetch(request);
}