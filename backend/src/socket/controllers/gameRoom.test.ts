import { MessageType } from '@defferrard/algoo-core/src/socket';
import { Server as HTTPSServer, createServer } from 'http';
import { useContainer } from 'routing-controllers';
import { Server as IOServer } from 'socket.io';
import { Socket, io } from 'socket.io-client';
import { Container } from 'typedi';
import { app } from '~/app';
import init from '~/socketio';
import { socketOnce } from '~/test/utils';

const BASE_URL: string = '/rooms';
const AUTH_BASE_URL: string = '/api/v1/auth';
describe(`Socket Base Test ${BASE_URL}`, () => {
  let httpServer: HTTPSServer;
  let ioServer: IOServer;
  let socket: Socket;
  beforeAll(() => {
    useContainer(Container);
    httpServer = createServer(app);
    ioServer = init(httpServer);
    httpServer.listen();
  });
  afterEach(() => {
    socket.close();
    Container.reset();
  });
  afterAll(() => {
    ioServer.close();
    httpServer.close();
  });

  test('Connect without authentication', async () => {
    socket = io(`http://localhost/`, {
      retries: 0,
    });

    socket.connect();
    const response = await socketOnce(socket, MessageType.CONNECT_ERROR);
    expect(response.context.statusText.code).toBe('ECONNREFUSED');
  });

  // test('Authenticate', async () => {
  // request(app).post(`${AUTH_BASE_URL}`).expect(Status.UNAUTHORIZED);
  // socket.connect();
  //
  // socket = io(`http://localhost/`, {
  //   retries: 0,
  // });
  // socket.once(MessageType.CONNECT_ERROR, (err: any) => {
  //   expect(err.context.statusText.code).toBe('ECONNREFUSED');
  //   done();
  // });
  // });
});
