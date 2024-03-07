import {io} from "socket.io-client";
import {get, writable} from 'svelte/store';
import {MessageType, User} from "@defferrard/algoo-core/src/socket";
import {localUser} from "$lib/stores/localUser";

let connected: boolean = false;

export const socket = (() => {
    console.log("Creating socket...")
    const IO = io();
    const {subscribe, set, update} = writable(IO);

    IO.on("*",function(event,data) {
        console.log(event);
        console.log(data);
    });

    async function connect(): Promise<User> {
        console.log("Connecting to server...");
        return new Promise((resolve, reject) => {
            if(connected) {
                resolve(get(localUser));
                return;
            }

            const USER: User = get(localUser);
            console.log("Beginning connection...")
            IO.on(MessageType.CONNECT, () => {
                console.log("Connected to server");
                IO.emit(MessageType.LOGIN, USER);
                resolve(USER );
            });
            set(IO);
        });
    }

    return {
        connect,
        subscribe,
        get: () => IO,
        emit: (type: MessageType, data?: any) => IO.emit(type, data),
        on: IO.on as (type: MessageType, listener: (...args: any[]) => void) => typeof IO
    };
})();