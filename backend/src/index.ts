import { PORT } from '$/const';
import { User } from '@defferrard/algoo-core/src/socket';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import dotenv from 'dotenv';
import express, { Express, NextFunction, Request, Response } from 'express';
import { createServer } from 'http';
import { SchemaObject } from 'openapi3-ts/src/model/OpenApi';
import passport from 'passport';
import 'reflect-metadata';
import {
  Action,
  createExpressServer,
  getMetadataArgsStorage,
  RoutingControllersOptions,
  useContainer,
} from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import { SocketControllers } from 'socket-controllers';
import { Server } from 'socket.io';
import * as swaggerUiExpress from 'swagger-ui-express';
import { Container } from 'typedi';

import { authenticate, router as auth } from './auth';
import { LOGGER, middleware as loggerMiddleware } from './utils/logger';

dotenv.config();

useContainer(Container);
const routingControllersOptions: RoutingControllersOptions = {
  routePrefix: '/api/v1',
  middlewares: [loggerMiddleware],
  controllers: [__dirname + '/controllers/*'],
  validation: {
    whitelist: true,
  },
  authorizationChecker: async (action: Action, _roles: any[]) =>
    new Promise<boolean>((resolve: Function, reject: Function) => {
      passport.authenticate('jwt', (err?: Error, user?: User) => {
        if (err) return reject(err);
        if (!user) return resolve(false);
        action.request.user = user;
        return resolve(true);
      })(action.request, action.response, action.next);
    }),
  currentUserChecker: (action: Action) => action.request.user,
};
const APP: Express = createExpressServer(routingControllersOptions);
const HTTP_SERVER = createServer(APP);
const IO: Server = new Server(HTTP_SERVER, {
  path: '/socket.io',
});
Container.set(Server, IO);
IO.engine.use((req: Request & {
  _query: { sid: string | undefined }
}, res: Response, next: NextFunction) => {
  const isHandshake: boolean = req._query.sid === undefined;
  if (isHandshake) {
    authenticate(req, res, next);
  } else {
    next();
  }
});

new SocketControllers({
  io: IO,
  container: Container,
  controllers: [__dirname + '/socket/controllers/*'],
});
const schemas: SchemaObject = validationMetadatasToSchemas({
  refPointerPrefix: '#/components/schemas/',
});
const spec = routingControllersToSpec(getMetadataArgsStorage(), routingControllersOptions, {
  components: {
    schemas,
  },
});
APP.use(express.json())
  .use(auth)
  .get('/api/v1', (req, res) => {
    res.redirect('/api/v1/docs');
  })
  .use('/api/v1/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(spec));
HTTP_SERVER.listen(PORT, () => {
  LOGGER.info(`Server is running at http://localhost:${PORT}`);
});