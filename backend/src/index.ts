import 'reflect-metadata';
import dotenv from 'dotenv';
import express, {Express, NextFunction} from 'express';
import {Server, Socket} from 'socket.io';
import {LOGGER} from "./utils/logger";
import {createServer, type IncomingMessage, type ServerResponse} from "http";

import {SocketMap} from "./socket";
import {router} from "./routes"
import {authenticate, router as auth} from "./auth";
import {SocketControllers} from "socket-controllers";
import {Container} from 'typedi';


dotenv.config();

export const APP: Express = express();
const PORT: number = +(process.env.PORT || 8080);
const HTTP_SERVER = createServer(APP);
const IO: Server = new Server(HTTP_SERVER, {
    path: '/socket.io'
});
Container.set(Server, IO);
IO.engine.use((req: IncomingMessage & {
    _query: { sid: string | undefined }
}, res: ServerResponse, next: NextFunction) => {
    const isHandshake: boolean = req._query.sid === undefined;
    if (isHandshake) {
        authenticate(req, res, next);
    } else {
        next();
    }
});

const SOCKET_MAP: SocketMap = new SocketMap();
const SOCKET_ON_CONNECTION: Socket[] = [];

new SocketControllers({
    io: IO,
    container: Container,
    controllers: [__dirname + '/socket/ctrl/*'],
})

APP.use(express.json())
    .use((req, res, next) => {
        LOGGER.info(`${req.method} ${req.url}`);
        next();
    })
    .use('/api/v1', router)
    .use(auth);
// IO.on(MessageType.CONNECTION, (socket: Socket) => {
//     let socketUser: SocketUser;
//     LOGGER.info('Socket connected, waiting for log in.');
//     SOCKET_ON_CONNECTION.push(socket);
//     delay(() => {
//         if (SOCKET_ON_CONNECTION.includes(socket)) {
//             LOGGER.info('Timeout, socket did not login in time');
//             socket.disconnect(true);
//         }
//     }, 10000);
//
//
//     socket.on(MessageType.LOGIN, (user: User, callback) => {
//         LOGGER.info(`Socket ${user.uuid} logged in`);
//         SOCKET_ON_CONNECTION.splice(SOCKET_ON_CONNECTION.indexOf(socket), 1);
//         socketUser = new SocketUser(user, socket, IO);
//         SOCKET_MAP.push(socketUser);
//         callback({status: SocketStatus.OK});
//     }).on(MessageType.DISCONNECT, () => {
//         LOGGER.info('Socket disconnected');
//         SOCKET_ON_CONNECTION.splice(SOCKET_ON_CONNECTION.indexOf(socket), 1);
//         if (socketUser) {
//             socketUser.disconnect();
//         }
//     });
// });

HTTP_SERVER.listen(PORT, () => {
    LOGGER.info(`Server is running at http://localhost:${PORT}`);
});

