import { Socket } from "socket.io";import type {User} from "@defferrard/algoo-core/src/socket";


export default class SocketMap{
    private readonly _socketToUUID: {[key: string]: User}
    private readonly _uuidToSocket: {[key: string]: [Socket, User]}

    constructor(){
        this._socketToUUID = {};
        this._uuidToSocket = {};
    }

    push(socket: Socket, user: User){
        const SID:string = socket.client.conn.transport.sid;

        if(this._socketToUUID[SID]){
            delete this._uuidToSocket[this._socketToUUID[SID].uuid];
        }
        if(this._uuidToSocket[user.uuid]){
            delete this._socketToUUID[this._uuidToSocket[user.uuid][0].client.conn.transport.sid];
        }


        this._socketToUUID[SID] = user;
        this._uuidToSocket[user.uuid] = [socket, user];
    }

    getSocket(uuid: string): [Socket, User] | undefined{
        return this._uuidToSocket[uuid];
    }

    getUUID(socket: Socket): User | undefined{
        return this._socketToUUID[socket.client.conn.transport.sid];
    }

    timeout(socket: Socket){
        // Socket has disconnected, give him 1 minute to reconnect, or else remove him from the map
    }
}