import Status from 'http-status';
import { useContainer } from 'routing-controllers';
import request from 'supertest';
import { Container } from 'typedi';
import { app } from '~/app';


const BASE_URL: string = '/api/v1/rooms';
describe(`Base Test ${BASE_URL}`, () => {
  beforeAll(() => {
    useContainer(Container);
  });
  afterEach(() => {
    Container.reset();
  });

  test('Create a room', async () => {
    let res = await request(app).get(BASE_URL).expect(Status.OK);
    expect(res.body).toEqual([]);

    res = await request(app).post(BASE_URL).expect(Status.OK);
    expect(res.body).toMatchObject({});
    const room = res.body;

    res = await request(app).get(BASE_URL).expect(Status.OK);
    expect(res.body).toHaveLength(1);
    expect(res.body[0]).toMatchObject(room);
  });
});
