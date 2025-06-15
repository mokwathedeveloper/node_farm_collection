const request = require('supertest');
const app = require('../src/server');
const Order = require('../src/models/orderModel');
const Product = require('../src/models/Product');
const {
  createTestProduct,
  createAuthenticatedUser,
  createAuthenticatedAdmin
} = require('./utils/testHelpers');

describe('Order Endpoints', () => {
  let user, userHeaders, admin, adminHeaders, product;

  beforeEach(async () => {
    // Create test user and admin
    const userData = await createAuthenticatedUser();
    user = userData.user;
    userHeaders = userData.headers;

    const adminData = await createAuthenticatedAdmin();
    admin = adminData.user;
    adminHeaders = adminData.headers;

    // Create test product
    product = await createTestProduct({ countInStock: 10 });
  });

  const createOrderData = () => ({
    orderItems: [
      {
        name: product.name,
        qty: 2,
        image: product.image,
        price: product.price,
        product: product._id
      }
    ],
    shippingAddress: {
      address: '123 Test Street',
      city: 'Test City',
      postalCode: '12345',
      country: 'Test Country'
    },
    paymentMethod: 'PayPal',
    itemsPrice: product.price * 2,
    taxPrice: (product.price * 2) * 0.1,
    shippingPrice: 10,
    totalPrice: (product.price * 2) + ((product.price * 2) * 0.1) + 10
  });

  describe('POST /api/orders', () => {
    test('should create order successfully', async () => {
      const orderData = createOrderData();

      const response = await request(app)
        .post('/api/orders')
        .set(userHeaders)
        .send(orderData);

      expect(response.status).toBe(201);
      expect(response.body.user).toBe(user._id.toString());
      expect(response.body.orderItems).toHaveLength(1);
      expect(response.body.totalPrice).toBe(orderData.totalPrice);
      expect(response.body.status).toBe('pending');
    });

    test('should not create order without authentication', async () => {
      const orderData = createOrderData();

      const response = await request(app)
        .post('/api/orders')
        .send(orderData);

      expect(response.status).toBe(401);
    });

    test('should not create order with empty order items', async () => {
      const orderData = createOrderData();
      orderData.orderItems = [];

      const response = await request(app)
        .post('/api/orders')
        .set(userHeaders)
        .send(orderData);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('No order items');
    });

    test('should not create order with insufficient stock', async () => {
      const orderData = createOrderData();
      orderData.orderItems[0].qty = 20; // More than available stock

      const response = await request(app)
        .post('/api/orders')
        .set(userHeaders)
        .send(orderData);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Insufficient stock');
    });

    test('should not create order with non-existent product', async () => {
      const orderData = createOrderData();
      orderData.orderItems[0].product = '507f1f77bcf86cd799439011';

      const response = await request(app)
        .post('/api/orders')
        .set(userHeaders)
        .send(orderData);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Product not found');
    });

    test('should update product stock after order creation', async () => {
      const orderData = createOrderData();
      const originalStock = product.countInStock;

      await request(app)
        .post('/api/orders')
        .set(userHeaders)
        .send(orderData);

      const updatedProduct = await Product.findById(product._id);
      expect(updatedProduct.countInStock).toBe(originalStock - orderData.orderItems[0].qty);
    });
  });

  describe('GET /api/orders/myorders', () => {
    test('should get user orders', async () => {
      // Create orders for the user
      const orderData = createOrderData();
      await request(app)
        .post('/api/orders')
        .set(userHeaders)
        .send(orderData);

      await request(app)
        .post('/api/orders')
        .set(userHeaders)
        .send(orderData);

      const response = await request(app)
        .get('/api/orders/myorders')
        .set(userHeaders);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      response.body.forEach(order => {
        expect(order.user).toBe(user._id.toString());
      });
    });

    test('should not get orders without authentication', async () => {
      const response = await request(app)
        .get('/api/orders/myorders');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/orders/:id', () => {
    test('should get order by ID for owner', async () => {
      const orderData = createOrderData();
      const createResponse = await request(app)
        .post('/api/orders')
        .set(userHeaders)
        .send(orderData);

      const orderId = createResponse.body._id;

      const response = await request(app)
        .get(`/api/orders/${orderId}`)
        .set(userHeaders);

      expect(response.status).toBe(200);
      expect(response.body._id).toBe(orderId);
      expect(response.body.user._id).toBe(user._id.toString());
    });

    test('should get order by ID for admin', async () => {
      const orderData = createOrderData();
      const createResponse = await request(app)
        .post('/api/orders')
        .set(userHeaders)
        .send(orderData);

      const orderId = createResponse.body._id;

      const response = await request(app)
        .get(`/api/orders/${orderId}`)
        .set(adminHeaders);

      expect(response.status).toBe(200);
      expect(response.body._id).toBe(orderId);
    });

    test('should not get order for unauthorized user', async () => {
      const orderData = createOrderData();
      const createResponse = await request(app)
        .post('/api/orders')
        .set(userHeaders)
        .send(orderData);

      const orderId = createResponse.body._id;

      // Create another user
      const { headers: otherUserHeaders } = await createAuthenticatedUser();

      const response = await request(app)
        .get(`/api/orders/${orderId}`)
        .set(otherUserHeaders);

      expect(response.status).toBe(403);
    });

    test('should return 404 for non-existent order', async () => {
      const fakeId = '507f1f77bcf86cd799439011';

      const response = await request(app)
        .get(`/api/orders/${fakeId}`)
        .set(userHeaders);

      expect(response.status).toBe(404);
    });
  });

  describe('GET /api/orders/admin', () => {
    test('should get all orders as admin', async () => {
      // Create multiple orders
      const orderData = createOrderData();
      await request(app)
        .post('/api/orders')
        .set(userHeaders)
        .send(orderData);

      await request(app)
        .post('/api/orders')
        .set(userHeaders)
        .send(orderData);

      const response = await request(app)
        .get('/api/orders/admin')
        .set(adminHeaders);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
    });

    test('should not get all orders as regular user', async () => {
      const response = await request(app)
        .get('/api/orders/admin')
        .set(userHeaders);

      expect(response.status).toBe(403);
    });
  });

  describe('PUT /api/orders/:id/status', () => {
    test('should update order status as admin', async () => {
      const orderData = createOrderData();
      const createResponse = await request(app)
        .post('/api/orders')
        .set(userHeaders)
        .send(orderData);

      const orderId = createResponse.body._id;

      const response = await request(app)
        .put(`/api/orders/${orderId}/status`)
        .set(adminHeaders)
        .send({ status: 'processing' });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('processing');
    });

    test('should not update order status as regular user', async () => {
      const orderData = createOrderData();
      const createResponse = await request(app)
        .post('/api/orders')
        .set(userHeaders)
        .send(orderData);

      const orderId = createResponse.body._id;

      const response = await request(app)
        .put(`/api/orders/${orderId}/status`)
        .set(userHeaders)
        .send({ status: 'processing' });

      expect(response.status).toBe(403);
    });

    test('should not update order with invalid status', async () => {
      const orderData = createOrderData();
      const createResponse = await request(app)
        .post('/api/orders')
        .set(userHeaders)
        .send(orderData);

      const orderId = createResponse.body._id;

      const response = await request(app)
        .put(`/api/orders/${orderId}/status`)
        .set(adminHeaders)
        .send({ status: 'invalid-status' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid status');
    });

    test('should update isDelivered when status is delivered', async () => {
      const orderData = createOrderData();
      const createResponse = await request(app)
        .post('/api/orders')
        .set(userHeaders)
        .send(orderData);

      const orderId = createResponse.body._id;

      const response = await request(app)
        .put(`/api/orders/${orderId}/status`)
        .set(adminHeaders)
        .send({ status: 'delivered' });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('delivered');
      expect(response.body.isDelivered).toBe(true);
      expect(response.body.deliveredAt).toBeDefined();
    });
  });

  describe('PUT /api/orders/:id/cancel', () => {
    test('should cancel order as owner', async () => {
      const orderData = createOrderData();
      const createResponse = await request(app)
        .post('/api/orders')
        .set(userHeaders)
        .send(orderData);

      const orderId = createResponse.body._id;

      const response = await request(app)
        .put(`/api/orders/${orderId}/cancel`)
        .set(userHeaders);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('cancelled');
    });

    test('should not cancel delivered order', async () => {
      const orderData = createOrderData();
      const createResponse = await request(app)
        .post('/api/orders')
        .set(userHeaders)
        .send(orderData);

      const orderId = createResponse.body._id;

      // First deliver the order
      await request(app)
        .put(`/api/orders/${orderId}/status`)
        .set(adminHeaders)
        .send({ status: 'delivered' });

      // Try to cancel delivered order
      const response = await request(app)
        .put(`/api/orders/${orderId}/cancel`)
        .set(userHeaders);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Cannot cancel delivered order');
    });

    test('should restore product stock when order is cancelled', async () => {
      const orderData = createOrderData();
      const originalStock = product.countInStock;

      const createResponse = await request(app)
        .post('/api/orders')
        .set(userHeaders)
        .send(orderData);

      const orderId = createResponse.body._id;

      await request(app)
        .put(`/api/orders/${orderId}/cancel`)
        .set(userHeaders);

      const updatedProduct = await Product.findById(product._id);
      expect(updatedProduct.countInStock).toBe(originalStock);
    });
  });
});
