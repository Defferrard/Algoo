import { createServer } from 'http';
import type { Server as HTTPSServer } from 'http';
import 'reflect-metadata';
import { useContainer } from 'routing-controllers';
import { Container } from 'typedi';
import { app } from '~/app';
import { PORT } from '~/const';
import init from '~/socketio';
import { LOGGER } from '~/utils/logger';

useContainer(Container);

export const HTTP_SERVER: HTTPSServer = createServer(app);
init(HTTP_SERVER);
HTTP_SERVER.listen(PORT, () => {
  LOGGER.info(`Server is running at http://localhost:${PORT}`);
});
