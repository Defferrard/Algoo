import { InterceptorInterface, SocketEventContext } from 'socket-controllers';
import { Service } from 'typedi';

@Service()
export class Authenticated implements InterceptorInterface {
  use(ctx: SocketEventContext, next: () => Promise<any>): any {
    if (ctx.socket.data.user) {
      return next();
    }
  }
}
