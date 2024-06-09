import { User } from '@defferrard/algoo-core/src/socket';
import passport from 'passport';
import { Action, RoutingControllersOptions } from 'routing-controllers';
import { middleware as loggerMiddleware } from '~/utils/logger';


export const routingControllersOptions: RoutingControllersOptions = {
  routePrefix: '/api/v1',
  middlewares: [loggerMiddleware],
  controllers: [__dirname + '/controllers/*Ctrl.*'],
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
