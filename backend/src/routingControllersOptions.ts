import { AuthCtrl } from './controllers/AuthCtrl';
import { GameRoomCtrl } from './controllers/GameRoomCtrl';
import { User } from '@defferrard/algoo-core/src/socket';
import passport from 'passport';
import { Action, RoutingControllersOptions } from 'routing-controllers';
import { middleware as loggerMiddleware } from '~/utils/logger';

export const routingControllersOptions: RoutingControllersOptions = {
  routePrefix: '/api/v1',
  middlewares: [loggerMiddleware],
  // NOTE :
  // Controllers directory discovery is not working with routing-controllers-openapi
  // TODO: Waiting for https://github.com/epiphone/routing-controllers-openapi/issues/81 to be resolved
  controllers: [AuthCtrl, GameRoomCtrl],
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
