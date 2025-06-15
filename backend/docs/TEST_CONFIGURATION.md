# Test Configuration Documentation

## Overview

This document describes the test configuration setup for the e-commerce backend API. It covers Jest configuration, test environment setup, and testing best practices.

## Jest Configuration

### Package.json Configuration

```json
{
  "scripts": {
    "test": "cross-env NODE_ENV=test jest",
    "test:watch": "cross-env NODE_ENV=test jest --watch",
    "test:coverage": "cross-env NODE_ENV=test jest --coverage",
    "test:verbose": "cross-env NODE_ENV=test jest --verbose"
  },
  "jest": {
    "testEnvironment": "node",
    "setupFilesAfterEnv": ["<rootDir>/tests/setup.js"],
    "testMatch": ["**/tests/**/*.test.js"],
    "collectCoverageFrom": [
      "src/**/*.js",
      "!src/server.js",
      "!src/config/db.js"
    ],
    "coverageDirectory": "coverage",
    "coverageReporters": ["text", "lcov", "html"],
    "coverageThreshold": {
      "global": {
        "branches": 75,
        "functions": 80,
        "lines": 80,
        "statements": 80
      }
    }
  }
}
```

### Configuration Options Explained

- **testEnvironment**: Set to "node" for Node.js environment
- **setupFilesAfterEnv**: Points to setup file for test initialization
- **testMatch**: Pattern to find test files
- **collectCoverageFrom**: Files to include in coverage analysis
- **coverageDirectory**: Output directory for coverage reports
- **coverageReporters**: Types of coverage reports to generate
- **coverageThreshold**: Minimum coverage requirements

## Test Environment Setup

### Environment Variables

```bash
NODE_ENV=test
JWT_SECRET=test-secret-key
MONGO_URI=mongodb://localhost:27017/test-db
PORT=5001
EMAIL_HOST=smtp.test.com
EMAIL_PORT=587
EMAIL_USER=test@example.com
EMAIL_PASS=test-password
SUPER_ADMIN_SETUP_KEY=test-setup-key
```

### Test Setup File (tests/setup.js)

```javascript
// Simple test setup without MongoDB Memory Server
// Tests will use the existing database connection

// Increase timeout for API operations
jest.setTimeout(30000);

// Mock console.log to reduce noise during tests
global.console = {
  ...console,
  log: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: console.error, // Keep error logs for debugging
};
```

### Test Database Configuration

The tests use the existing MongoDB connection rather than an in-memory database for simplicity and real-world testing scenarios.

**Benefits**:
- Tests against actual database implementation
- Validates real database operations
- Simpler setup and configuration

**Considerations**:
- Requires database cleanup between tests
- Slower than in-memory alternatives
- Requires database access during testing

## Test Utilities

### Test Helper Functions (tests/utils/testHelpers.js)

```javascript
const { faker } = require('@faker-js/faker');
const jwt = require('jsonwebtoken');
const { User } = require('../../src/models/User');
const Product = require('../../src/models/Product');

// Generate realistic test data
const generateUserData = (overrides = {}) => ({
  name: faker.person.fullName(),
  email: faker.internet.email(),
  password: 'password123',
  role: 'client',
  ...overrides
});

// Create authenticated user for testing
const createAuthenticatedUser = async (userData = {}) => {
  const user = await createTestUser(userData);
  const token = generateToken(user._id);
  return { user, token, headers: getAuthHeaders(token) };
};

// Generate JWT token for testing
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'testsecret', {
    expiresIn: '30d'
  });
};
```

### Data Generation

Using Faker.js for realistic test data:

```javascript
// User data generation
const userData = {
  name: faker.person.fullName(),        // "John Doe"
  email: faker.internet.email(),       // "john@example.com"
  password: 'password123',
  role: 'client'
};

// Product data generation
const productData = {
  name: faker.commerce.productName(),   // "Handcrafted Steel Shoes"
  price: parseFloat(faker.commerce.price()), // 99.99
  description: faker.commerce.productDescription(),
  category: faker.commerce.department(), // "Electronics"
  brand: faker.company.name(),
  countInStock: faker.number.int({ min: 0, max: 100 })
};
```

## Test Structure

### Test File Organization

```
tests/
├── setup.js                 # Global test setup
├── utils/
│   └── testHelpers.js       # Reusable test utilities
├── auth.test.js             # Authentication tests
├── products.test.js         # Product management tests
├── orders.test.js           # Order system tests
├── users.test.js            # User management tests
├── cart.test.js             # Shopping cart tests
├── reviews.test.js          # Review system tests
├── middleware.test.js       # Middleware tests
└── simple-api.test.js       # Basic API tests
```

### Test Naming Conventions

```javascript
describe('Authentication Endpoints', () => {
  describe('POST /api/auth/register', () => {
    test('should register a new user successfully', async () => {
      // Test implementation
    });
    
    test('should not register user with existing email', async () => {
      // Test implementation
    });
  });
});
```

### Test Categories

1. **Unit Tests**: Test individual functions and methods
2. **Integration Tests**: Test API endpoints and workflows
3. **Authentication Tests**: Test security and access control
4. **Validation Tests**: Test input validation and error handling
5. **Performance Tests**: Test response times and resource usage

## Supertest Configuration

### Basic Setup

```javascript
const request = require('supertest');
const app = require('../src/server');

describe('API Tests', () => {
  test('should respond to GET /api/products', async () => {
    const response = await request(app)
      .get('/api/products')
      .expect('Content-Type', /json/)
      .expect(200);
    
    expect(response.body).toHaveProperty('products');
  });
});
```

### Authentication Testing

```javascript
// Test with authentication
const { headers } = await createAuthenticatedUser();

const response = await request(app)
  .get('/api/auth/profile')
  .set(headers)
  .expect(200);
```

### Request/Response Testing

```javascript
// POST request with data
const response = await request(app)
  .post('/api/auth/register')
  .send({
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123'
  })
  .expect('Content-Type', /json/)
  .expect(201);

// Validate response structure
expect(response.body).toHaveProperty('_id');
expect(response.body).toHaveProperty('token');
expect(response.body.email).toBe('test@example.com');
```

## Coverage Configuration

### Coverage Collection

```javascript
"collectCoverageFrom": [
  "src/**/*.js",           // Include all source files
  "!src/server.js",        // Exclude main server file
  "!src/config/db.js"      // Exclude database config
]
```

### Coverage Thresholds

```javascript
"coverageThreshold": {
  "global": {
    "branches": 75,    // 75% branch coverage
    "functions": 80,   // 80% function coverage
    "lines": 80,       // 80% line coverage
    "statements": 80   // 80% statement coverage
  }
}
```

### Coverage Reports

Generated coverage reports:
- **Text**: Console output during test run
- **LCOV**: Machine-readable format for CI/CD
- **HTML**: Interactive web-based report

## Test Execution

### Command Line Options

```bash
# Basic test execution
npm test

# Watch mode for development
npm run test:watch

# Coverage analysis
npm run test:coverage

# Verbose output
npm run test:verbose

# Run specific test file
npm test -- tests/auth.test.js

# Run tests matching pattern
npm test -- --testNamePattern="authentication"

# Run tests in specific directory
npm test -- tests/

# Debug mode
npm test -- --detectOpenHandles

# Update snapshots
npm test -- --updateSnapshot
```

### Parallel Execution

Jest runs tests in parallel by default:

```javascript
// Control parallel execution
"jest": {
  "maxWorkers": 4,        // Limit worker processes
  "runInBand": false      // Disable parallel execution
}
```

## Debugging Tests

### Debug Configuration

```bash
# Run with Node.js debugger
node --inspect-brk node_modules/.bin/jest --runInBand

# Enable debug logging
DEBUG=* npm test

# Detect memory leaks
npm test -- --detectOpenHandles --forceExit
```

### Common Debug Scenarios

1. **Hanging Tests**: Use --detectOpenHandles
2. **Memory Leaks**: Monitor resource usage
3. **Database Issues**: Check connection and cleanup
4. **Async Problems**: Ensure proper await usage

## Continuous Integration

### CI Configuration

```yaml
# GitHub Actions example
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm install
      - run: npm test
      - run: npm run test:coverage
```

### Environment Setup for CI

```bash
# CI environment variables
NODE_ENV=test
JWT_SECRET=ci-test-secret
MONGO_URI=mongodb://localhost:27017/ci-test-db
```

## Best Practices

### Test Organization

1. **Group Related Tests**: Use describe blocks
2. **Clear Test Names**: Describe expected behavior
3. **Setup and Teardown**: Use beforeEach/afterEach
4. **Test Isolation**: Each test should be independent

### Data Management

1. **Fresh Data**: Generate new data for each test
2. **Cleanup**: Remove test data after tests
3. **Realistic Data**: Use Faker.js for realistic values
4. **Edge Cases**: Test boundary conditions

### Assertion Strategies

1. **Specific Assertions**: Test exact values when possible
2. **Structure Validation**: Verify response structure
3. **Error Testing**: Test error conditions
4. **Status Codes**: Validate HTTP status codes

### Performance Considerations

1. **Test Speed**: Keep tests fast and focused
2. **Resource Usage**: Monitor memory and CPU usage
3. **Database Operations**: Minimize database calls
4. **Parallel Execution**: Leverage Jest's parallel capabilities

## Troubleshooting

### Common Issues

1. **Port Conflicts**: Use different ports for testing
2. **Database Connections**: Ensure proper connection handling
3. **Async Operations**: Use proper async/await patterns
4. **Memory Leaks**: Clean up resources after tests

### Debug Commands

```bash
# Verbose test output
npm run test:verbose

# Detect open handles
npm test -- --detectOpenHandles

# Force exit after tests
npm test -- --forceExit

# Run tests serially
npm test -- --runInBand
```
