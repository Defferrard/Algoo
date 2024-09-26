import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { getMetadataArgsStorage } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import { routingControllersOptions } from '~/routingControllersOptions';

const schemas: any = validationMetadatasToSchemas({
  refPointerPrefix: '#/components/schemas/',
});
export const openApiSpec = routingControllersToSpec(getMetadataArgsStorage(), routingControllersOptions, {
  openapi: '3.1.0',
  components: {
    schemas,
  },
});
