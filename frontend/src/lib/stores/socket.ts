import {io} from "socket.io-client";
import {get, writable} from 'svelte/store';
import {MessageType, SocketStatus, User} from "@defferrard/algoo-core/src/socket";
import {localUser} from "$lib/stores/localUser";
import {loadingMutex} from "$lib/components";

let connected: boolean = false;

export const socket = (() => {
    const IO = io({
        autoConnect: false
    });
    const {subscribe, set, update} = writable(IO);

    IO.onAny((event, ...args) => {
        console.log(event, args);
        set(IO);
    });

    async function connect(): Promise<User> {
        loadingMutex.increment();
        // TODO : Mutex on IO
        return new Promise((resolve, reject) => {
            if (connected) {
                loadingMutex.decrement();
                resolve(get(localUser));
                return;
            }
            IO.connect();

            const USER: User = get(localUser);
            IO.on(MessageType.CONNECT, () => {
                IO.emit(MessageType.LOGIN, USER, ({status}:{status:SocketStatus})=>{
                    switch (status) {
                        case SocketStatus.OK:
                            connected = true;
                            set(IO);
                            loadingMutex.decrement();
                            resolve(USER);
                            break;
                        default:
                            IO.disconnect();
                            loadingMutex.decrement();
                            reject({status});
                            break;
                    }
                });
            }).on(MessageType.DISCONNECT, () => {
                connected = false;
                set(IO);
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