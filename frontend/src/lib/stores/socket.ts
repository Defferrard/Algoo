import {io} from "socket.io-client";
import {get, writable} from 'svelte/store';
import {MessageType, SocketStatus, User} from "@defferrard/algoo-core/src/socket";
import {localUser} from "$lib/stores/localUser";

let connected: boolean = false;

export const socket = (() => {
    const IO = io({
        autoConnect: false
    });
    const {subscribe, set, update} = writable(IO);

    IO.on("*", function (event, data) {
        console.log(event);
        console.log(data);
    });

    IO.onAny((event, ...args) => {
        console.log(event, args);
        set(IO);
    });

    async function connect(): Promise<User> {
        IO.connect();
        return new Promise((resolve, reject) => {
            if (connected) {
                resolve(get(localUser));
                return;
            }

            const USER: User = get(localUser);
            IO.on(MessageType.CONNECT, () => {
                IO.emit(MessageType.LOGIN, USER, ({status}:{status:SocketStatus})=>{
                    switch (status) {
                        case SocketStatus.OK:
                            resolve(USER);
                            set(IO);
                            break;
                        default:
                            IO.disconnect();
                            reject({status});
                    }
                });
            });
        });
    }

    return {
        connect,
        subscribe,
        get: () => IO,
        emit: (type: MessageType, data?: any, ack?: (data: any) => void) => IO.emit(type, data, ack),
        on: function (type: MessageType, listener: (...args: any[]) => void) {
            IO.on(type, listener);
        }
    };
})();