import express, { Express } from 'express';
import { createExpressServer } from 'routing-controllers';
import * as swaggerUiExpress from 'swagger-ui-express';
import { router as auth } from '~/auth';
import { openApiSpec } from '~/openAPI';
import { routingControllersOptions } from '~/routingControllersOptions';

export const app: Express = createExpressServer(routingControllersOptions);

app
  .use(express.json())
  .use(auth)
  .get('/api/v1', (_req, res) => {
    res.redirect('/api/v1/docs');
  })
  .get('/api/v1/docs/json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(openApiSpec);
  })
  .use('/api/v1/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(openApiSpec, { explorer: true }));
