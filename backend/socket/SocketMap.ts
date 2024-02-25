import { Socket } from "socket.io";

export default class SocketMap{
    private readonly _socketToUUID: {[key: string]: string}
    private readonly _uuidToSocket: {[key: string]: Socket}

    constructor(){
        this._socketToUUID = {};
        this._uuidToSocket = {};
    }

    push(socket: Socket, uuid: string){
        const SID:string = socket.client.conn.transport.sid;

        if(this._socketToUUID[SID]){
            delete this._uuidToSocket[this._socketToUUID[SID]];
        }
        if(this._uuidToSocket[uuid]){
            delete this._socketToUUID[this._uuidToSocket[uuid].client.conn.transport.sid];
        }


        this._socketToUUID[SID] = uuid;
        this._uuidToSocket[uuid] = socket;
    }

    getSocket(uuid: string): Socket | undefined{
        return this._uuidToSocket[uuid];
    }

    getUUID(socket: Socket): string | undefined{
        return this._socketToUUID[socket.client.conn.transport.sid];
    }

    timeout(socket: Socket){
        // Socket has disconnected, give him 1 minute to reconnect, or else remove him from the map
    }
}