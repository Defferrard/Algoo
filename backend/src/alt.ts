import { PORT } from '$/const';
import express, { Express } from 'express';
import { createServer } from 'http';
import 'reflect-metadata';
import { Server } from 'socket.io';
import { LOGGER } from './utils/logger';

const APP: Express = express();
const HTTP_SERVER = createServer(APP);
const IO: Server = new Server(HTTP_SERVER, {
  path: '/socket.io',
});

IO.on('connection', (socket) => {
  LOGGER.info(`Socket ${socket.id} connected`);
  socket.emit('a', 'Hello, World!');
  socket.on('a', () => {
    LOGGER.info(`Socket ${socket.id} disconnected`);
    socket.emit('b', 'Hello, World!');
    IO.emit('c', 'Hello, World!');
  });
});
IO.on('c', (message) => {
  console.log('NEW MESSAGE: ', message);
});
IO.on('b', (message) => {
  console.log('NEW MESSAGE: ', message);
});
IO.on('a', (message) => {
  console.log('NEW MESSAGE: ', message);
});
HTTP_SERVER.listen(PORT, () => {
  LOGGER.info(`Server is running at http://localhost:${PORT}`);
});