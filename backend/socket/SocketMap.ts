import { Socket } from "socket.io";
import SocketUser from "./SocketUser";


export default class SocketMap{
    private readonly _socketToUser: {[key: string]: SocketUser}
    private readonly _uuidToSocket: {[key: string]: SocketUser}

    constructor(){
        this._socketToUser = {};
        this._uuidToSocket = {};
    }

    push(socketUser: SocketUser){
        const SID:string = socketUser.socket.client.conn.transport.sid;

        if(this._socketToUser[SID]){
            delete this._uuidToSocket[this._socketToUser[SID].uuid];
        }
        if(this._uuidToSocket[socketUser.uuid]){
            this._uuidToSocket[socketUser.uuid].socket.disconnect();
            delete this._socketToUser[this._uuidToSocket[socketUser.uuid].socket.client.conn.transport.sid];
        }


        this._socketToUser[SID] = socketUser;
        this._uuidToSocket[socketUser.uuid] = socketUser;
    }

    getSocket(uuid: string): SocketUser | undefined{
        return this._uuidToSocket[uuid];
    }

    getUser(socket: Socket): SocketUser | undefined{
        return this._socketToUser[socket.client.conn.transport.sid];
    }

    timeout(socket: Socket){
        // Socket has disconnected, give him 1 minute to reconnect, or else remove him from the map
    }
}