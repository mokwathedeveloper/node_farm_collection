# API Testing Guide

## Overview

This guide provides detailed information about testing the e-commerce backend API endpoints. It covers test scenarios, expected responses, and validation criteria for each endpoint category.

## Authentication Endpoints

### POST /api/auth/register

**Purpose**: Register a new user account

**Test Scenarios**:

1. **Valid Registration**
   ```javascript
   // Input
   {
     "name": "John Doe",
     "email": "john@example.com",
     "password": "password123"
   }
   
   // Expected Response: 201
   {
     "_id": "user_id",
     "name": "John Doe",
     "email": "john@example.com",
     "role": "client",
     "token": "jwt_token"
   }
   ```

2. **Duplicate Email**
   ```javascript
   // Expected Response: 400
   {
     "message": "User already exists"
   }
   ```

3. **Invalid Email Format**
   ```javascript
   // Input
   {
     "email": "invalid-email"
   }
   
   // Expected Response: 400
   {
     "message": "Invalid email format"
   }
   ```

4. **Missing Required Fields**
   ```javascript
   // Input: {}
   // Expected Response: 400
   {
     "message": "All fields are required"
   }
   ```

### POST /api/auth/login

**Purpose**: Authenticate user and return JWT token

**Test Scenarios**:

1. **Valid Login**
   ```javascript
   // Input
   {
     "email": "john@example.com",
     "password": "password123"
   }
   
   // Expected Response: 200
   {
     "_id": "user_id",
     "name": "John Doe",
     "email": "john@example.com",
     "role": "client",
     "token": "jwt_token"
   }
   ```

2. **Invalid Credentials**
   ```javascript
   // Expected Response: 401
   {
     "message": "Invalid email or password"
   }
   ```

3. **Inactive Account**
   ```javascript
   // Expected Response: 401
   {
     "message": "Account is deactivated"
   }
   ```

### GET /api/auth/profile

**Purpose**: Get authenticated user profile

**Headers Required**: `Authorization: Bearer <token>`

**Test Scenarios**:

1. **Valid Token**
   ```javascript
   // Expected Response: 200
   {
     "_id": "user_id",
     "name": "John Doe",
     "email": "john@example.com",
     "role": "client"
   }
   ```

2. **Missing Token**
   ```javascript
   // Expected Response: 401
   {
     "message": "Not authorized, no token"
   }
   ```

3. **Invalid Token**
   ```javascript
   // Expected Response: 401
   {
     "message": "Not authorized, token failed"
   }
   ```

## Product Endpoints

### GET /api/products

**Purpose**: Retrieve products with filtering and pagination

**Query Parameters**:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `category`: Filter by category
- `search`: Search in product names
- `sortBy`: Sort field (price, name, createdAt)
- `sortOrder`: Sort direction (asc, desc)

**Test Scenarios**:

1. **Basic Product List**
   ```javascript
   // Expected Response: 200
   {
     "products": [...],
     "totalProducts": 50,
     "totalPages": 5,
     "currentPage": 1
   }
   ```

2. **Category Filter**
   ```javascript
   // URL: /api/products?category=Electronics
   // Expected: Only electronics products
   ```

3. **Search Functionality**
   ```javascript
   // URL: /api/products?search=iPhone
   // Expected: Products containing "iPhone"
   ```

4. **Pagination**
   ```javascript
   // URL: /api/products?page=2&limit=5
   // Expected: Page 2 with 5 items
   ```

### GET /api/products/:id

**Purpose**: Get single product details

**Test Scenarios**:

1. **Valid Product ID**
   ```javascript
   // Expected Response: 200
   {
     "_id": "product_id",
     "name": "Product Name",
     "price": 99.99,
     "description": "Product description",
     "category": "Electronics",
     "stock": 10
   }
   ```

2. **Invalid Product ID**
   ```javascript
   // Expected Response: 404
   {
     "message": "Product not found"
   }
   ```

### POST /api/products

**Purpose**: Create new product (Admin only)

**Headers Required**: `Authorization: Bearer <admin_token>`

**Test Scenarios**:

1. **Valid Product Creation**
   ```javascript
   // Input
   {
     "name": "New Product",
     "price": 99.99,
     "description": "Product description",
     "category": "Electronics",
     "stock": 10
   }
   
   // Expected Response: 201
   ```

2. **Unauthorized Access**
   ```javascript
   // No admin token
   // Expected Response: 401/403
   ```

3. **Missing Required Fields**
   ```javascript
   // Expected Response: 400
   ```

## Order Endpoints

### POST /api/orders

**Purpose**: Create new order

**Headers Required**: `Authorization: Bearer <token>`

**Test Scenarios**:

1. **Valid Order Creation**
   ```javascript
   // Input
   {
     "orderItems": [
       {
         "name": "Product Name",
         "qty": 2,
         "price": 99.99,
         "product": "product_id"
       }
     ],
     "shippingAddress": {
       "address": "123 Main St",
       "city": "City",
       "postalCode": "12345",
       "country": "Country"
     },
     "paymentMethod": "PayPal",
     "totalPrice": 199.98
   }
   
   // Expected Response: 201
   ```

2. **Empty Order Items**
   ```javascript
   // Expected Response: 400
   {
     "message": "No order items"
   }
   ```

3. **Insufficient Stock**
   ```javascript
   // Expected Response: 400
   {
     "message": "Insufficient stock for product"
   }
   ```

### GET /api/orders/myorders

**Purpose**: Get user's orders

**Headers Required**: `Authorization: Bearer <token>`

**Test Scenarios**:

1. **User Orders List**
   ```javascript
   // Expected Response: 200
   [
     {
       "_id": "order_id",
       "orderItems": [...],
       "totalPrice": 199.98,
       "status": "pending"
     }
   ]
   ```

### GET /api/orders/admin

**Purpose**: Get all orders (Admin only)

**Headers Required**: `Authorization: Bearer <admin_token>`

**Test Scenarios**:

1. **Admin Orders Access**
   ```javascript
   // Expected Response: 200
   // Returns all orders
   ```

2. **Non-Admin Access**
   ```javascript
   // Expected Response: 403
   {
     "message": "Not authorized as admin"
   }
   ```

## Cart Endpoints

### GET /api/cart

**Purpose**: Get user's cart

**Test Scenarios**:

1. **Guest Cart**
   ```javascript
   // No auth header
   // Expected Response: 200
   {
     "items": [],
     "totalPrice": 0
   }
   ```

2. **Authenticated User Cart**
   ```javascript
   // With auth header
   // Expected Response: 200
   {
     "items": [...],
     "totalPrice": 99.99
   }
   ```

### POST /api/cart

**Purpose**: Add item to cart

**Test Scenarios**:

1. **Valid Item Addition**
   ```javascript
   // Input
   {
     "productId": "product_id",
     "quantity": 2
   }
   
   // Expected Response: 200
   ```

2. **Invalid Product ID**
   ```javascript
   // Expected Response: 404
   {
     "message": "Product not found"
   }
   ```

3. **Insufficient Stock**
   ```javascript
   // Expected Response: 400
   {
     "message": "Insufficient stock"
   }
   ```

## User Management Endpoints

### GET /api/superadmin/users

**Purpose**: Get all users (SuperAdmin only)

**Headers Required**: `Authorization: Bearer <superadmin_token>`

**Test Scenarios**:

1. **SuperAdmin Access**
   ```javascript
   // Expected Response: 200
   [
     {
       "_id": "user_id",
       "name": "User Name",
       "email": "user@example.com",
       "role": "client"
     }
   ]
   ```

2. **Non-SuperAdmin Access**
   ```javascript
   // Expected Response: 403
   {
     "message": "Not authorized as super admin"
   }
   ```

### PUT /api/superadmin/users/:id/role

**Purpose**: Update user role

**Headers Required**: `Authorization: Bearer <superadmin_token>`

**Test Scenarios**:

1. **Valid Role Update**
   ```javascript
   // Input
   {
     "role": "admin"
   }
   
   // Expected Response: 200
   ```

2. **Invalid Role**
   ```javascript
   // Input
   {
     "role": "invalid_role"
   }
   
   // Expected Response: 400
   {
     "message": "Invalid role"
   }
   ```

## Error Response Format

All error responses follow this format:

```javascript
{
  "message": "Error description",
  "stack": "Error stack trace (development only)"
}
```

## Status Codes

- **200**: Success
- **201**: Created
- **400**: Bad Request
- **401**: Unauthorized
- **403**: Forbidden
- **404**: Not Found
- **500**: Internal Server Error

## Testing Tools

### Supertest Example

```javascript
const request = require('supertest');
const app = require('../src/server');

describe('API Tests', () => {
  test('should get products', async () => {
    const response = await request(app)
      .get('/api/products')
      .expect('Content-Type', /json/)
      .expect(200);
    
    expect(response.body).toHaveProperty('products');
  });
});
```

### Authentication Helper

```javascript
const getAuthHeaders = (token) => ({
  Authorization: `Bearer ${token}`
});

// Usage
const response = await request(app)
  .get('/api/auth/profile')
  .set(getAuthHeaders(userToken));
```

## Validation Rules

### User Registration
- Name: Required, 2-50 characters
- Email: Required, valid email format
- Password: Required, minimum 6 characters

### Product Creation
- Name: Required, 2-100 characters
- Price: Required, positive number
- Description: Required, 10-1000 characters
- Category: Required, valid category
- Stock: Required, non-negative integer

### Order Creation
- Order Items: Required, non-empty array
- Shipping Address: Required, complete address
- Payment Method: Required, valid method
- Total Price: Required, positive number
