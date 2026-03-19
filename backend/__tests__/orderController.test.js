const request = require('supertest');
const express = require('express');
const orderRoutes = require('../routes/orderRoutes');
const Order = require('../models/Order');

// Mock the Order model
jest.mock('../models/Order');

const app = express();
app.use(express.json());
app.use('/api/orders', orderRoutes);

describe('Order API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch all orders', async () => {
    const mockOrders = [{ id: '1', customer: 'test' }];
    const findMock = {
      sort: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      skip: jest.fn().mockResolvedValue(mockOrders),
    };
    Order.find.mockReturnValue(findMock);
    Order.countDocuments.mockResolvedValue(1);

    const res = await request(app).get('/api/orders');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      success: true,
      data: mockOrders,
      pagination: {
        total: 1,
        page: 1,
        limit: 100,
        pages: 1,
      },
    });
    expect(Order.find).toHaveBeenCalledTimes(1);
  });

  it('should create a new order', async () => {
    const newOrder = { customer: 'New Customer', amount: 100 };
    const savedOrder = { _id: '2', ...newOrder };

    // Mock the constructor and save method
    Order.mockImplementation(function(orderData) {
      const self = { ...orderData };
      self.save = jest.fn().mockResolvedValue({
        ...self,
        _id: '2',
        toJSON: () => ({ ...self, _id: '2' }),
      });
      return self;
    });


    const res = await request(app)
      .post('/api/orders')
      .send(newOrder);

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Order created successfully');
    expect(res.body.data.customer).toBe(newOrder.customer);
    expect(res.body.data.amount).toBe(newOrder.amount);
  });
});
