import { NextFunction, Request, Response } from 'express';
import type { Server as HTTPSServer } from 'http';
import { SocketControllers } from 'socket-controllers';
import { Server } from 'socket.io';
import { Container } from 'typedi';
import { authenticate } from '~/auth';


export default function init(httpServer: HTTPSServer): Server {
  const io: Server = new Server(httpServer, {
    path: '/socket.io',
  });
  Container.set(Server, io);
  io.engine.use(
    (
      req: Request & {
        _query: { sid: string | undefined };
      },
      res: Response,
      next: NextFunction,
    ) => {
      const isHandshake: boolean = req._query.sid === undefined;
      if (isHandshake) {
        authenticate(req, res, next);
      } else {
        next();
      }
    },
  );

  new SocketControllers({
    io: io,
    container: Container,
    controllers: [__dirname + '/socket/controllers/*Ctrl.*'],
  });
  return io;
}
