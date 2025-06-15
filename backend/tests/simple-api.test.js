const request = require('supertest');
const app = require('../src/server');

describe('Simple API Endpoint Tests', () => {
  describe('Server Health Check', () => {
    test('should respond to basic requests', async () => {
      const response = await request(app)
        .get('/api/products')
        .expect('Content-Type', /json/);

      expect(response.status).toBe(200);
    });
  });

  describe('Authentication Endpoints', () => {
    test('POST /api/auth/register - should handle registration request', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      // Should get some response (either success or validation error)
      expect([200, 201, 400, 409]).toContain(response.status);
    });

    test('POST /api/auth/login - should handle login request', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData);

      // Should get some response (either success or auth error)
      expect([200, 401, 400]).toContain(response.status);
    });

    test('GET /api/auth/profile - should require authentication', async () => {
      const response = await request(app)
        .get('/api/auth/profile');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('Product Endpoints', () => {
    test('GET /api/products - should return products', async () => {
      const response = await request(app)
        .get('/api/products');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('products');
    });

    test('GET /api/products/featured - should return featured products', async () => {
      const response = await request(app)
        .get('/api/products/featured');

      expect([200, 404]).toContain(response.status);
    });

    test('POST /api/products - should require authentication', async () => {
      const productData = {
        name: 'Test Product',
        price: 99.99,
        description: 'Test description'
      };

      const response = await request(app)
        .post('/api/products')
        .send(productData);

      expect(response.status).toBe(401);
    });
  });

  describe('Cart Endpoints', () => {
    test('GET /api/cart - should handle guest users', async () => {
      const response = await request(app)
        .get('/api/cart');

      // Cart allows guest users, so should return 200
      expect(response.status).toBe(200);
    });

    test('POST /api/cart - should handle add to cart', async () => {
      const response = await request(app)
        .post('/api/cart')
        .send({ productId: '507f1f77bcf86cd799439011', quantity: 1 });

      // Should get some response (success or validation error)
      expect([200, 400, 404]).toContain(response.status);
    });
  });

  describe('Order Endpoints', () => {
    test('GET /api/orders/myorders - should require authentication', async () => {
      const response = await request(app)
        .get('/api/orders/myorders');

      expect(response.status).toBe(401);
    });

    test('GET /api/orders/admin - should require admin authentication', async () => {
      const response = await request(app)
        .get('/api/orders/admin');

      expect(response.status).toBe(401);
    });

    test('POST /api/orders - should require authentication', async () => {
      const orderData = {
        orderItems: [],
        shippingAddress: {},
        paymentMethod: 'PayPal'
      };

      const response = await request(app)
        .post('/api/orders')
        .send(orderData);

      expect(response.status).toBe(401);
    });
  });

  describe('SuperAdmin Endpoints', () => {
    test('GET /api/superadmin/users - should require superadmin authentication', async () => {
      const response = await request(app)
        .get('/api/superadmin/users');

      expect(response.status).toBe(401);
    });

    test('GET /api/auth/check-superadmin - should check superadmin existence', async () => {
      const response = await request(app)
        .get('/api/auth/check-superadmin');

      expect([200, 404]).toContain(response.status);
    });
  });

  describe('Error Handling', () => {
    test('should handle 404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/api/non-existent-endpoint');

      expect(response.status).toBe(404);
    });

    test('should handle invalid JSON', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send('invalid json');

      expect([400, 500]).toContain(response.status);
    });
  });

  describe('CORS and Headers', () => {
    test('should include CORS headers with origin', async () => {
      const response = await request(app)
        .get('/api/products')
        .set('Origin', 'http://localhost:3000');

      // CORS headers should be present when origin is set
      expect(response.headers['access-control-allow-origin']).toBeDefined();
    });

    test('should handle OPTIONS requests', async () => {
      const response = await request(app)
        .options('/api/products')
        .set('Origin', 'http://localhost:3000')
        .set('Access-Control-Request-Method', 'GET');

      expect([200, 204]).toContain(response.status);
    });
  });
});
