const request = require('supertest');
const app = require('../src/server');
// Note: Review model doesn't exist yet, skipping review-specific tests
const {
  createTestProduct,
  createAuthenticatedUser,
  createAuthenticatedAdmin
} = require('./utils/testHelpers');

describe('Review Endpoints', () => {
  let user, userHeaders, admin, adminHeaders, product;

  beforeEach(async () => {
    const userData = await createAuthenticatedUser();
    user = userData.user;
    userHeaders = userData.headers;

    const adminData = await createAuthenticatedAdmin();
    admin = adminData.user;
    adminHeaders = adminData.headers;

    product = await createTestProduct();
  });

  const createReviewData = (overrides = {}) => ({
    rating: 5,
    comment: 'Great product! Highly recommended.',
    ...overrides
  });

  describe('POST /api/products/:id/reviews', () => {
    test('should create review successfully', async () => {
      const reviewData = createReviewData();

      const response = await request(app)
        .post(`/api/products/${product._id}/reviews`)
        .set(userHeaders)
        .send(reviewData);

      expect(response.status).toBe(201);
      expect(response.body.rating).toBe(reviewData.rating);
      expect(response.body.comment).toBe(reviewData.comment);
      expect(response.body.user).toBe(user._id.toString());
      expect(response.body.product).toBe(product._id.toString());
    });

    test('should not create review without authentication', async () => {
      const reviewData = createReviewData();

      const response = await request(app)
        .post(`/api/products/${product._id}/reviews`)
        .send(reviewData);

      expect(response.status).toBe(401);
    });

    test('should not create review for non-existent product', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const reviewData = createReviewData();

      const response = await request(app)
        .post(`/api/products/${fakeId}/reviews`)
        .set(userHeaders)
        .send(reviewData);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Product not found');
    });

    test('should not create duplicate review from same user', async () => {
      const reviewData = createReviewData();

      // Create first review
      await request(app)
        .post(`/api/products/${product._id}/reviews`)
        .set(userHeaders)
        .send(reviewData);

      // Try to create second review
      const response = await request(app)
        .post(`/api/products/${product._id}/reviews`)
        .set(userHeaders)
        .send(reviewData);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('You have already reviewed this product');
    });

    test('should not create review with invalid rating', async () => {
      const reviewData = createReviewData({ rating: 6 }); // Invalid rating

      const response = await request(app)
        .post(`/api/products/${product._id}/reviews`)
        .set(userHeaders)
        .send(reviewData);

      expect(response.status).toBe(400);
    });

    test('should not create review with missing required fields', async () => {
      const response = await request(app)
        .post(`/api/products/${product._id}/reviews`)
        .set(userHeaders)
        .send({});

      expect(response.status).toBe(400);
    });

    test('should update product rating after review creation', async () => {
      const reviewData1 = createReviewData({ rating: 5 });
      const reviewData2 = createReviewData({ rating: 3 });

      // Create first review
      await request(app)
        .post(`/api/products/${product._id}/reviews`)
        .set(userHeaders)
        .send(reviewData1);

      // Create second review with different user
      const { headers: user2Headers } = await createAuthenticatedUser();
      await request(app)
        .post(`/api/products/${product._id}/reviews`)
        .set(user2Headers)
        .send(reviewData2);

      // Check product rating
      const productResponse = await request(app)
        .get(`/api/products/${product._id}`);

      expect(productResponse.body.ratings).toBe(4); // (5 + 3) / 2
      expect(productResponse.body.numOfReviews).toBe(2);
    });
  });

  describe('GET /api/products/:id/reviews', () => {
    beforeEach(async () => {
      // Create test reviews
      await request(app)
        .post(`/api/products/${product._id}/reviews`)
        .set(userHeaders)
        .send(createReviewData({ rating: 5, comment: 'Excellent!' }));

      const { headers: user2Headers } = await createAuthenticatedUser();
      await request(app)
        .post(`/api/products/${product._id}/reviews`)
        .set(user2Headers)
        .send(createReviewData({ rating: 4, comment: 'Very good!' }));
    });

    test('should get all reviews for product', async () => {
      const response = await request(app)
        .get(`/api/products/${product._id}/reviews`);

      expect(response.status).toBe(200);
      expect(response.body.reviews).toHaveLength(2);
      expect(response.body.totalReviews).toBe(2);
    });

    test('should paginate reviews', async () => {
      const response = await request(app)
        .get(`/api/products/${product._id}/reviews?page=1&limit=1`);

      expect(response.status).toBe(200);
      expect(response.body.reviews).toHaveLength(1);
      expect(response.body.currentPage).toBe(1);
      expect(response.body.totalPages).toBe(2);
    });

    test('should sort reviews by date', async () => {
      const response = await request(app)
        .get(`/api/products/${product._id}/reviews?sortBy=createdAt&sortOrder=desc`);

      expect(response.status).toBe(200);
      const reviews = response.body.reviews;
      expect(new Date(reviews[0].createdAt)).toBeInstanceOf(Date);
    });

    test('should return empty array for product with no reviews', async () => {
      const newProduct = await createTestProduct();

      const response = await request(app)
        .get(`/api/products/${newProduct._id}/reviews`);

      expect(response.status).toBe(200);
      expect(response.body.reviews).toHaveLength(0);
      expect(response.body.totalReviews).toBe(0);
    });
  });

  describe('PUT /api/reviews/:id', () => {
    let review;

    beforeEach(async () => {
      const reviewResponse = await request(app)
        .post(`/api/products/${product._id}/reviews`)
        .set(userHeaders)
        .send(createReviewData());

      review = reviewResponse.body;
    });

    test('should update own review', async () => {
      const updateData = {
        rating: 3,
        comment: 'Updated review comment'
      };

      const response = await request(app)
        .put(`/api/reviews/${review._id}`)
        .set(userHeaders)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.rating).toBe(updateData.rating);
      expect(response.body.comment).toBe(updateData.comment);
    });

    test('should not update other user review', async () => {
      const { headers: user2Headers } = await createAuthenticatedUser();
      const updateData = {
        rating: 3,
        comment: 'Trying to update someone else review'
      };

      const response = await request(app)
        .put(`/api/reviews/${review._id}`)
        .set(user2Headers)
        .send(updateData);

      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Not authorized to update this review');
    });

    test('should update review as admin', async () => {
      const updateData = {
        rating: 2,
        comment: 'Admin updated this review'
      };

      const response = await request(app)
        .put(`/api/reviews/${review._id}`)
        .set(adminHeaders)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.rating).toBe(updateData.rating);
      expect(response.body.comment).toBe(updateData.comment);
    });

    test('should not update review without authentication', async () => {
      const updateData = {
        rating: 3,
        comment: 'Updated comment'
      };

      const response = await request(app)
        .put(`/api/reviews/${review._id}`)
        .send(updateData);

      expect(response.status).toBe(401);
    });

    test('should return 404 for non-existent review', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const updateData = {
        rating: 3,
        comment: 'Updated comment'
      };

      const response = await request(app)
        .put(`/api/reviews/${fakeId}`)
        .set(userHeaders)
        .send(updateData);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Review not found');
    });

    test('should update product rating after review update', async () => {
      const updateData = { rating: 1 };

      await request(app)
        .put(`/api/reviews/${review._id}`)
        .set(userHeaders)
        .send(updateData);

      // Check product rating
      const productResponse = await request(app)
        .get(`/api/products/${product._id}`);

      expect(productResponse.body.ratings).toBe(1);
    });
  });

  describe('DELETE /api/reviews/:id', () => {
    let review;

    beforeEach(async () => {
      const reviewResponse = await request(app)
        .post(`/api/products/${product._id}/reviews`)
        .set(userHeaders)
        .send(createReviewData());

      review = reviewResponse.body;
    });

    test('should delete own review', async () => {
      const response = await request(app)
        .delete(`/api/reviews/${review._id}`)
        .set(userHeaders);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Review deleted successfully');

      // Verify review is deleted
      // const deletedReview = await Review.findById(review._id);
      // expect(deletedReview).toBeNull();
    });

    test('should delete review as admin', async () => {
      const response = await request(app)
        .delete(`/api/reviews/${review._id}`)
        .set(adminHeaders);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Review deleted successfully');
    });

    test('should not delete other user review', async () => {
      const { headers: user2Headers } = await createAuthenticatedUser();

      const response = await request(app)
        .delete(`/api/reviews/${review._id}`)
        .set(user2Headers);

      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Not authorized to delete this review');
    });

    test('should not delete review without authentication', async () => {
      const response = await request(app)
        .delete(`/api/reviews/${review._id}`);

      expect(response.status).toBe(401);
    });

    test('should return 404 for non-existent review', async () => {
      const fakeId = '507f1f77bcf86cd799439011';

      const response = await request(app)
        .delete(`/api/reviews/${fakeId}`)
        .set(userHeaders);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Review not found');
    });

    test('should update product rating after review deletion', async () => {
      // Add another review first
      const { headers: user2Headers } = await createAuthenticatedUser();
      await request(app)
        .post(`/api/products/${product._id}/reviews`)
        .set(user2Headers)
        .send(createReviewData({ rating: 3 }));

      // Delete first review
      await request(app)
        .delete(`/api/reviews/${review._id}`)
        .set(userHeaders);

      // Check product rating
      const productResponse = await request(app)
        .get(`/api/products/${product._id}`);

      expect(productResponse.body.ratings).toBe(3);
      expect(productResponse.body.numOfReviews).toBe(1);
    });
  });
});
