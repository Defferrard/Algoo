import { JwtDTO } from '@defferrard/algoo-core/src/dto';
import { transformAndValidate } from 'class-transformer-validator';
import Status from 'http-status';
import { useContainer } from 'routing-controllers';
import request from 'supertest';
import { Container } from 'typedi';
import { app } from '~/app';

const BASE_URL: string = '/api/v1/auth';
describe(`Base Test ${BASE_URL}`, () => {
  beforeAll(() => {
    useContainer(Container);
  });
  afterEach(() => {
    Container.reset();
  });

  test('Authenticate', async () => {
    await request(app).get(`${BASE_URL}/current`).expect(Status.UNAUTHORIZED);

    const response = await request(app).post(`${BASE_URL}/`).send({
      name: 'test',
    });
    expect(response.status).toBe(Status.OK);
    await transformAndValidate(JwtDTO, response.body);
  });
});
