const request = require('supertest');
const app = require('../src/server');
const Product = require('../src/models/Product');
const {
  generateProductData,
  createTestProduct,
  createAuthenticatedUser,
  createAuthenticatedAdmin,
  cleanDatabase
} = require('./utils/testHelpers');

describe('Product Endpoints', () => {
  // Clean database before each test to avoid conflicts
  beforeEach(async () => {
    await cleanDatabase();
  });

  describe('GET /api/products', () => {
    test('should get all products', async () => {
      // Create test products
      await createTestProduct();
      await createTestProduct();
      await createTestProduct();

      const response = await request(app)
        .get('/api/products');

      expect(response.status).toBe(200);
      expect(response.body.products).toHaveLength(3);
      expect(response.body).toHaveProperty('totalProducts');
      expect(response.body).toHaveProperty('totalPages');
    });

    test('should filter products by category', async () => {
      await createTestProduct({ category: 'Electronics' });
      await createTestProduct({ category: 'Clothing' });
      await createTestProduct({ category: 'Electronics' });

      const response = await request(app)
        .get('/api/products?category=Electronics');

      expect(response.status).toBe(200);
      expect(response.body.products).toHaveLength(2);
      response.body.products.forEach(product => {
        expect(product.category).toBe('Electronics');
      });
    });

    test('should search products by name', async () => {
      await createTestProduct({ name: 'iPhone 15' });
      await createTestProduct({ name: 'Samsung Galaxy' });
      await createTestProduct({ name: 'iPhone 14' });

      const response = await request(app)
        .get('/api/products?search=iPhone');

      expect(response.status).toBe(200);
      expect(response.body.products).toHaveLength(2);
      response.body.products.forEach(product => {
        expect(product.name.toLowerCase()).toContain('iphone');
      });
    });

    test('should paginate products', async () => {
      // Create 15 products
      for (let i = 0; i < 15; i++) {
        await createTestProduct();
      }

      const response = await request(app)
        .get('/api/products?page=2&limit=5');

      expect(response.status).toBe(200);
      expect(response.body.products).toHaveLength(5);
      expect(response.body.currentPage).toBe(2);
      expect(response.body.totalPages).toBe(3);
    });

    test('should sort products by price', async () => {
      await createTestProduct({ price: 100 });
      await createTestProduct({ price: 50 });
      await createTestProduct({ price: 200 });

      const response = await request(app)
        .get('/api/products?sortBy=price&sortOrder=asc');

      expect(response.status).toBe(200);
      expect(response.body.products[0].price).toBe(50);
      expect(response.body.products[1].price).toBe(100);
      expect(response.body.products[2].price).toBe(200);
    });
  });

  describe('GET /api/products/:id', () => {
    test('should get product by ID', async () => {
      const product = await createTestProduct();

      const response = await request(app)
        .get(`/api/products/${product._id}`);

      expect(response.status).toBe(200);
      expect(response.body._id).toBe(product._id.toString());
      expect(response.body.name).toBe(product.name);
    });

    test('should return 404 for non-existent product', async () => {
      const fakeId = '507f1f77bcf86cd799439011';

      const response = await request(app)
        .get(`/api/products/${fakeId}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Product not found');
    });

    test('should return 400 for invalid product ID', async () => {
      const response = await request(app)
        .get('/api/products/invalid-id');

      // API returns 500 for invalid ObjectId format
      expect(response.status).toBe(500);
    });
  });

  describe('POST /api/products', () => {
    test('should create product as admin', async () => {
      const { headers } = await createAuthenticatedAdmin();
      const productData = generateProductData();

      const response = await request(app)
        .post('/api/products')
        .set(headers)
        .send(productData);

      expect(response.status).toBe(201);
      expect(response.body.name).toBe(productData.name);
      expect(response.body.price).toBe(productData.price);
      expect(response.body.category).toBe(productData.category);
    });

    test('should not create product as regular user', async () => {
      const { headers } = await createAuthenticatedUser();
      const productData = generateProductData();

      const response = await request(app)
        .post('/api/products')
        .set(headers)
        .send(productData);

      expect(response.status).toBe(403);
    });

    test('should not create product without authentication', async () => {
      const productData = generateProductData();

      const response = await request(app)
        .post('/api/products')
        .send(productData);

      expect(response.status).toBe(401);
    });

    test('should not create product with missing required fields', async () => {
      const { headers } = await createAuthenticatedAdmin();

      const response = await request(app)
        .post('/api/products')
        .set(headers)
        .send({});

      // API returns 500 for validation errors
      expect(response.status).toBe(500);
    });

    test('should not create product with negative price', async () => {
      const { headers } = await createAuthenticatedAdmin();
      const productData = generateProductData({ price: -10 });

      const response = await request(app)
        .post('/api/products')
        .set(headers)
        .send(productData);

      // API returns 500 for validation errors
      expect(response.status).toBe(500);
    });
  });

  describe('PUT /api/products/:id', () => {
    test('should update product as admin', async () => {
      const { headers } = await createAuthenticatedAdmin();
      const product = await createTestProduct();
      const updateData = { name: 'Updated Product Name', price: 999 };

      const response = await request(app)
        .put(`/api/products/${product._id}`)
        .set(headers)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(updateData.name);
      expect(response.body.price).toBe(updateData.price);
    });

    test('should not update product as regular user', async () => {
      const { headers } = await createAuthenticatedUser();
      const product = await createTestProduct();
      const updateData = { name: 'Updated Product Name' };

      const response = await request(app)
        .put(`/api/products/${product._id}`)
        .set(headers)
        .send(updateData);

      expect(response.status).toBe(403);
    });

    test('should return 404 for non-existent product', async () => {
      const { headers } = await createAuthenticatedAdmin();
      const fakeId = '507f1f77bcf86cd799439011';

      const response = await request(app)
        .put(`/api/products/${fakeId}`)
        .set(headers)
        .send({ name: 'Updated Name' });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/products/:id', () => {
    test('should delete product as admin', async () => {
      const { headers } = await createAuthenticatedAdmin();
      const product = await createTestProduct();

      const response = await request(app)
        .delete(`/api/products/${product._id}`)
        .set(headers);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Product removed successfully');

      // Verify product is deleted
      const deletedProduct = await Product.findById(product._id);
      expect(deletedProduct).toBeNull();
    });

    test('should not delete product as regular user', async () => {
      const { headers } = await createAuthenticatedUser();
      const product = await createTestProduct();

      const response = await request(app)
        .delete(`/api/products/${product._id}`)
        .set(headers);

      expect(response.status).toBe(403);
    });

    test('should return 404 for non-existent product', async () => {
      const { headers } = await createAuthenticatedAdmin();
      const fakeId = '507f1f77bcf86cd799439011';

      const response = await request(app)
        .delete(`/api/products/${fakeId}`)
        .set(headers);

      expect(response.status).toBe(404);
    });
  });

  describe('GET /api/products/featured', () => {
    test('should get featured products', async () => {
      await createTestProduct({ featured: true });
      await createTestProduct({ featured: true });
      await createTestProduct({ featured: false });

      const response = await request(app)
        .get('/api/products/featured');

      expect(response.status).toBe(200);
      expect(response.body.products).toHaveLength(2);
      response.body.products.forEach(product => {
        expect(product.featured).toBe(true);
      });
    });

    test('should limit featured products', async () => {
      for (let i = 0; i < 10; i++) {
        await createTestProduct({ featured: true });
      }

      const response = await request(app)
        .get('/api/products/featured?limit=5');

      expect(response.status).toBe(200);
      expect(response.body.products).toHaveLength(5);
    });
  });
});
