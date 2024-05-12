import {ConnectedSocket, OnConnect, OnMessage, SocketController} from "socket-controllers";
import {LOGGER} from "$/utils/logger";
import {Service} from "typedi";
import {Socket} from "socket.io";
import {SocketRepository} from "$/repositories";

@SocketController()
@Service()
export class BasicCtrl {
    constructor(public socketRepository: SocketRepository) {
    }

    @OnConnect()
    onConnect(@ConnectedSocket() socket: any): void {
        LOGGER.info(`Socket ${socket.id} connected`);
        this.socketRepository.save(socket, {uuid: socket.id, name: 'Anonymous'});
        console.log(this.socketRepository.emitTo(socket.id));
        socket.data = "SECRET :D";
    }

    @OnMessage("login")
    onLogin(@ConnectedSocket() socket: Socket): void {
        LOGGER.info(`Socket ${socket.id} logged in as`);
        console.log(socket.data);
        socket.emit("login", {uuid: socket.id, name: 'Anonymous'});
    }

    //
    // @OnDisconnect()
    // onDisconnect(@ConnectedSocket() socket: Socket): void {
    //     console.log("disconnect");
    //     console.log(socket.data);
    // }
}