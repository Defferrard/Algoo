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

    let res = await request(app).post(`${BASE_URL}/`).send({
      name: 'test',
    });
    expect(res.status).toBe(Status.OK);
    expect(typeof res.body).toBe('string');
    const jwt = res.body;
  });
});
