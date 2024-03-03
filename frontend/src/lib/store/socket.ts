import {io} from "socket.io-client";
import { writable } from 'svelte/store';
import {MessageType} from "@defferrard/algoo-core/src/socket";
import {v4 as uuidV4} from "uuid";

const UUID: string = uuidV4();
export const socket = (() => {
    const IO  = io();
    const {subscribe, set, update} = writable(IO);

    IO.on(MessageType.CONNECT, () => {
        console.log("Connected to server");
        IO.emit(MessageType.LOGIN, UUID)
    });

    return {
        subscribe,
        emit: (type : MessageType, data?: any) => IO.emit(type, data),
        on: IO.on as (type: MessageType, listener: (...args: any[]) => void) => typeof IO
    };
})();