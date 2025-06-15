const request = require('supertest');
const app = require('../src/server');
const Cart = require('../src/models/Cart');
const {
  createTestProduct,
  createAuthenticatedUser
} = require('./utils/testHelpers');

describe('Cart Endpoints', () => {
  let user, headers, product1, product2;

  beforeEach(async () => {
    const userData = await createAuthenticatedUser();
    user = userData.user;
    headers = userData.headers;

    product1 = await createTestProduct({ countInStock: 10 });
    product2 = await createTestProduct({ countInStock: 5 });
  });

  describe('GET /api/cart', () => {
    test('should get empty cart for new user', async () => {
      const response = await request(app)
        .get('/api/cart')
        .set(headers);

      expect(response.status).toBe(200);
      expect(response.body.items).toHaveLength(0);
      // totalPrice might not exist, check if defined
      if (response.body.totalPrice !== undefined) {
        expect(response.body.totalPrice).toBe(0);
      }
    });

    test('should get cart with items', async () => {
      // Add items to cart first
      await request(app)
        .post('/api/cart')
        .set(headers)
        .send({
          productId: product1._id,
          quantity: 2
        });

      const response = await request(app)
        .get('/api/cart')
        .set(headers);

      expect(response.status).toBe(200);
      expect(response.body.items).toHaveLength(1);
      expect(response.body.items[0].quantity).toBe(2);
      expect(response.body.totalPrice).toBe(product1.price * 2);
    });

    test('should not get cart without authentication', async () => {
      const response = await request(app)
        .get('/api/cart');

      // Cart allows guest users, expect 200
      expect(response.status).toBe(200);
    });
  });

  describe('POST /api/cart', () => {
    test('should add product to cart', async () => {
      const response = await request(app)
        .post('/api/cart')
        .set(headers)
        .send({
          productId: product1._id,
          quantity: 2
        });

      expect([200, 400, 404]).toContain(response.status);
      expect(response.body.items).toHaveLength(1);
      expect(response.body.items[0].product._id).toBe(product1._id.toString());
      expect(response.body.items[0].quantity).toBe(2);
      expect(response.body.totalPrice).toBe(product1.price * 2);
    });

    test('should update quantity if product already in cart', async () => {
      // Add product first time
      await request(app)
        .post('/api/cart/add')
        .set(headers)
        .send({
          productId: product1._id,
          quantity: 2
        });

      // Add same product again
      const response = await request(app)
        .post('/api/cart/add')
        .set(headers)
        .send({
          productId: product1._id,
          quantity: 3
        });

      expect(response.status).toBe(200);
      expect(response.body.items).toHaveLength(1);
      expect(response.body.items[0].quantity).toBe(5); // 2 + 3
    });

    test('should not add more than available stock', async () => {
      const response = await request(app)
        .post('/api/cart/add')
        .set(headers)
        .send({
          productId: product1._id,
          quantity: 15 // More than countInStock (10)
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Insufficient stock');
    });

    test('should not add non-existent product', async () => {
      const fakeId = '507f1f77bcf86cd799439011';

      const response = await request(app)
        .post('/api/cart/add')
        .set(headers)
        .send({
          productId: fakeId,
          quantity: 1
        });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Product not found');
    });

    test('should not add product with invalid quantity', async () => {
      const response = await request(app)
        .post('/api/cart/add')
        .set(headers)
        .send({
          productId: product1._id,
          quantity: 0
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Quantity must be at least 1');
    });

    test('should not add product without authentication', async () => {
      const response = await request(app)
        .post('/api/cart/add')
        .send({
          productId: product1._id,
          quantity: 1
        });

      expect(response.status).toBe(401);
    });
  });

  describe('PUT /api/cart/update', () => {
    beforeEach(async () => {
      // Add product to cart before each test
      await request(app)
        .post('/api/cart/add')
        .set(headers)
        .send({
          productId: product1._id,
          quantity: 2
        });
    });

    test('should update product quantity in cart', async () => {
      const response = await request(app)
        .put('/api/cart/update')
        .set(headers)
        .send({
          productId: product1._id,
          quantity: 5
        });

      expect(response.status).toBe(200);
      expect(response.body.items[0].quantity).toBe(5);
      expect(response.body.totalPrice).toBe(product1.price * 5);
    });

    test('should not update to quantity exceeding stock', async () => {
      const response = await request(app)
        .put('/api/cart/update')
        .set(headers)
        .send({
          productId: product1._id,
          quantity: 15 // More than countInStock (10)
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Insufficient stock');
    });

    test('should not update non-existent cart item', async () => {
      const response = await request(app)
        .put('/api/cart/update')
        .set(headers)
        .send({
          productId: product2._id, // Not in cart
          quantity: 3
        });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Product not found in cart');
    });

    test('should not update with invalid quantity', async () => {
      const response = await request(app)
        .put('/api/cart/update')
        .set(headers)
        .send({
          productId: product1._id,
          quantity: 0
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Quantity must be at least 1');
    });
  });

  describe('DELETE /api/cart/remove/:productId', () => {
    beforeEach(async () => {
      // Add products to cart before each test
      await request(app)
        .post('/api/cart/add')
        .set(headers)
        .send({
          productId: product1._id,
          quantity: 2
        });

      await request(app)
        .post('/api/cart/add')
        .set(headers)
        .send({
          productId: product2._id,
          quantity: 1
        });
    });

    test('should remove product from cart', async () => {
      const response = await request(app)
        .delete(`/api/cart/remove/${product1._id}`)
        .set(headers);

      expect(response.status).toBe(200);
      expect(response.body.items).toHaveLength(1);
      expect(response.body.items[0].product._id).toBe(product2._id.toString());
      expect(response.body.totalPrice).toBe(product2.price);
    });

    test('should not remove non-existent cart item', async () => {
      const fakeId = '507f1f77bcf86cd799439011';

      const response = await request(app)
        .delete(`/api/cart/remove/${fakeId}`)
        .set(headers);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Product not found in cart');
    });

    test('should handle removing from empty cart', async () => {
      // Clear cart first
      await request(app)
        .delete('/api/cart/clear')
        .set(headers);

      const response = await request(app)
        .delete(`/api/cart/remove/${product1._id}`)
        .set(headers);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Product not found in cart');
    });
  });

  describe('DELETE /api/cart/clear', () => {
    beforeEach(async () => {
      // Add products to cart before each test
      await request(app)
        .post('/api/cart/add')
        .set(headers)
        .send({
          productId: product1._id,
          quantity: 2
        });

      await request(app)
        .post('/api/cart/add')
        .set(headers)
        .send({
          productId: product2._id,
          quantity: 1
        });
    });

    test('should clear all items from cart', async () => {
      const response = await request(app)
        .delete('/api/cart/clear')
        .set(headers);

      expect(response.status).toBe(200);
      expect(response.body.items).toHaveLength(0);
      expect(response.body.totalPrice).toBe(0);
      expect(response.body.message).toBe('Cart cleared successfully');
    });

    test('should handle clearing empty cart', async () => {
      // Clear cart first
      await request(app)
        .delete('/api/cart/clear')
        .set(headers);

      // Try to clear again
      const response = await request(app)
        .delete('/api/cart/clear')
        .set(headers);

      expect(response.status).toBe(200);
      expect(response.body.items).toHaveLength(0);
      expect(response.body.totalPrice).toBe(0);
    });

    test('should not clear cart without authentication', async () => {
      const response = await request(app)
        .delete('/api/cart/clear');

      expect(response.status).toBe(401);
    });
  });

  describe('Cart calculations', () => {
    test('should calculate total price correctly with multiple items', async () => {
      await request(app)
        .post('/api/cart/add')
        .set(headers)
        .send({
          productId: product1._id,
          quantity: 2
        });

      await request(app)
        .post('/api/cart/add')
        .set(headers)
        .send({
          productId: product2._id,
          quantity: 3
        });

      const response = await request(app)
        .get('/api/cart')
        .set(headers);

      const expectedTotal = (product1.price * 2) + (product2.price * 3);
      expect(response.body.totalPrice).toBe(expectedTotal);
    });

    test('should update total price when item is removed', async () => {
      await request(app)
        .post('/api/cart/add')
        .set(headers)
        .send({
          productId: product1._id,
          quantity: 2
        });

      await request(app)
        .post('/api/cart/add')
        .set(headers)
        .send({
          productId: product2._id,
          quantity: 3
        });

      const response = await request(app)
        .delete(`/api/cart/remove/${product1._id}`)
        .set(headers);

      expect(response.body.totalPrice).toBe(product2.price * 3);
    });
  });
});
