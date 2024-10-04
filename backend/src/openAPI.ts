import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { getMetadataArgsStorage } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import { JsonObject } from 'swagger-ui-express';
import { routingControllersOptions } from '~/routingControllersOptions';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { defaultMetadataStorage } = require('class-transformer/cjs/storage');

const schemas: JsonObject = validationMetadatasToSchemas({
  refPointerPrefix: '#/components/schemas/',
  classTransformerMetadataStorage: defaultMetadataStorage,
});

export const openApiSpec: JsonObject = routingControllersToSpec(getMetadataArgsStorage(), routingControllersOptions, {
  openapi: '3.1.0',
  info: {
    title: 'Algoo API',
    version: '1.0.0',
    description: `Build from ${new Date()}`,
  },
  components: {
    schemas,
  },
});
