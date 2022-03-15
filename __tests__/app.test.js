const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const Order = require('../lib/models/Order');

describe('refactory routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('should be able to create an order', async () => {
    const res = await request(app)
      .post('/api/v1/orders')
      .send({ product: 'Widget', quantity: 1 });

    expect(res.body).toEqual({
      id: expect.any(String),
      product: 'Widget',
      quantity: 1,
    });
  });

  it('should be able to list an order by id', async () => {
    const order = await Order.insert({ product: 'Widget', quantity: 1 });
    const res = await request(app).get(`/api/v1/orders/${order.id}`);

    expect(res.body).toEqual(order);
  });

  it('should be able to list orders', async () => {
    await Order.insert({ product: 'Widget', quantity: 1 });
    const res = await request(app).get('/api/v1/orders');

    expect(res.body).toEqual([
      {
        id: expect.any(String),
        product: 'Widget',
        quantity: 1,
      },
    ]);
  });

  it('should be able to update an order', async () => {
    const order = await Order.insert({ product: 'Widget', quantity: 1 });
    const res = await request(app)
      .patch(`/api/v1/orders/${order.id}`)
      .send({ product: 'Thingamajig', quantity: 2 });

    const expected = {
      id: expect.any(String),
      product: 'Thingamajig',
      quantity: 2,
    };

    expect(res.body).toEqual(expected);
    expect(await Order.getById(order.id)).toEqual(expected);
  });

  it('should be able to delete an order', async () => {
    const order = await Order.getById({ product: 'Widget', quantity: 1 });
    const res = await request(app).delete(`/api/v1/orders/${order.id}`);

    expect(res.body).toEqual(order);
    expect(await Order.getById(order.id)).toBeNull();
  });
});
