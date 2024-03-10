import dotenv from 'dotenv';

dotenv.config();

import express, {Express, NextFunction} from 'express';
import {Server, Socket} from 'socket.io';
import {LOGGER} from "./utils/logger";
import {createServer} from "http";

import {SocketMap} from "./socket/";
import {MessageType} from "@defferrard/algoo-core/src/socket";
import type {User} from "@defferrard/algoo-core/src/socket";
import {delay} from "lodash";
import {router} from "./routes"
import cors from 'cors';

export const APP: Express = express();
const PORT: number = +(process.env.PORT || 8080);
const HTTP_SERVER = createServer(APP);
const IO: Server = new Server(HTTP_SERVER, {
    path: '/socket.io'
});

const SOCKET_MAP: SocketMap = new SocketMap();
const SOCKET_ON_CONNECTION: Socket[] = [];

const options: cors.CorsOptions = {
    origin: ['*'],
};

APP.use(express.json())
    .use((req, res, next) => {
        LOGGER.info(`${req.method} ${req.url}`);
        next();
    })
    .use('/api/v1', router);
IO.on(MessageType.CONNECTION, (socket: Socket) => {
    LOGGER.info('Socket connected, waiting for log in.');
    SOCKET_ON_CONNECTION.push(socket);
    delay(() => {
        if (SOCKET_ON_CONNECTION.includes(socket)) {
            LOGGER.info('Timeout, socket did not login in time');
            socket.disconnect(true);
        }
    }, 10000);


    socket.on(MessageType.LOGIN, (user: User, callback) => {
        LOGGER.info(`Socket ${user.uuid} logged in`);
        SOCKET_ON_CONNECTION.splice(SOCKET_ON_CONNECTION.indexOf(socket), 1);
        SOCKET_MAP.push(socket, user);
        callback({status: 200});
    });

    socket.on(MessageType.DISCONNECT, () => {
        LOGGER.info('Socket disconnected');
        SOCKET_ON_CONNECTION.splice(SOCKET_ON_CONNECTION.indexOf(socket), 1);
    });

    socket.on(MessageType.GAME_ROOM_JOIN, (room: string) => {
        LOGGER.info(`Socket ${SOCKET_MAP.getUUID(socket)} joined room ${room}`);
        socket.join(room);
    });

    socket.on(MessageType.GAME_ROOM_MESSAGE, ({room, message}) => {
        LOGGER.info(`Socket ${SOCKET_MAP.getUUID(socket)} sent message ${message}`);
        IO.to(room).emit(MessageType.GAME_ROOM_MESSAGE, {
            datetime: new Date(),
            from: SOCKET_MAP.getUUID(socket),
            message
        });
    });
});

HTTP_SERVER.listen(PORT, () => {
    LOGGER.info(`Server is running at http://localhost:${PORT}`);
});

