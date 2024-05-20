import express, { Express } from 'express';
import { createExpressServer } from 'routing-controllers';
import * as swaggerUiExpress from 'swagger-ui-express';
import { router as auth } from '~/auth';
import { routingControllersOptions } from '~/routingControllersOptions';

import { openApiSpec } from '../openAPI';


export const app: Express = createExpressServer(routingControllersOptions);

app
  .use(express.json())
  .use(auth)
  .get('/api/v1', (_req, res) => {
    res.redirect('/api/v1/docs');
  })
  .use(
    '/api/v1/docs',
    swaggerUiExpress.serve,
    swaggerUiExpress.setup(openApiSpec),
  );
