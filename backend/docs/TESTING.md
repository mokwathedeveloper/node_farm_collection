# Backend Testing Documentation

## Overview

This document provides comprehensive information about the testing framework implemented for the e-commerce backend application. The testing suite uses Jest and Supertest to provide thorough API endpoint testing.

## Testing Framework

### Technologies Used

- **Jest**: JavaScript testing framework for unit and integration tests
- **Supertest**: HTTP assertion library for testing Node.js HTTP servers
- **Cross-env**: Cross-platform environment variable setting
- **Faker.js**: Library for generating realistic test data

### Test Structure

```
backend/
├── tests/
│   ├── setup.js              # Test configuration and setup
│   ├── utils/
│   │   └── testHelpers.js     # Reusable test utilities
│   ├── auth.test.js           # Authentication endpoint tests
│   ├── products.test.js       # Product management tests
│   ├── orders.test.js         # Order system tests
│   ├── users.test.js          # User management tests
│   ├── cart.test.js           # Shopping cart tests
│   ├── reviews.test.js        # Review system tests
│   ├── middleware.test.js     # Middleware and security tests
│   └── simple-api.test.js     # Basic API endpoint tests
└── package.json               # Test scripts and dependencies
```

## Test Categories

### 1. Authentication Tests (auth.test.js)

Tests all authentication-related endpoints:

- User registration with validation
- User login with credentials
- Profile retrieval with JWT tokens
- SuperAdmin setup functionality
- Token validation and expiration
- Account activation/deactivation

**Key Test Cases:**
- Valid registration with proper data
- Duplicate email prevention
- Invalid email format handling
- Password validation
- Token-based authentication
- Inactive user login prevention

### 2. Product Tests (products.test.js)

Tests product management functionality:

- Product CRUD operations
- Search and filtering
- Pagination and sorting
- Featured products
- Stock management
- Admin-only operations

**Key Test Cases:**
- Product creation with admin privileges
- Product retrieval with filters
- Search functionality
- Pagination parameters
- Price sorting
- Stock validation

### 3. Order Tests (orders.test.js)

Tests order management system:

- Order creation and validation
- Status updates
- Admin order management
- Order cancellation
- Stock updates after orders

**Key Test Cases:**
- Order creation with valid data
- Stock validation during order
- Order status transitions
- Admin order access
- Order cancellation rules

### 4. User Management Tests (users.test.js)

Tests user administration features:

- SuperAdmin user management
- Role assignment and updates
- User activation/deactivation
- Admin creation
- Permission validation

**Key Test Cases:**
- SuperAdmin-only access
- Role update validation
- User status management
- Admin creation process
- Permission hierarchy

### 5. Cart Tests (cart.test.js)

Tests shopping cart functionality:

- Add items to cart
- Update quantities
- Remove items
- Cart calculations
- Guest and authenticated users

**Key Test Cases:**
- Cart item management
- Quantity validation
- Price calculations
- Stock availability checks
- Guest cart handling

### 6. Middleware Tests (middleware.test.js)

Tests security and middleware functionality:

- Authentication middleware
- Admin authorization
- SuperAdmin authorization
- Error handling
- Rate limiting
- CORS configuration

**Key Test Cases:**
- Token validation
- Role-based access control
- Error response formats
- Security headers
- Request rate limits

## Running Tests

### Prerequisites

Ensure all test dependencies are installed:

```bash
npm install --save-dev jest supertest cross-env @faker-js/faker
```

### Test Commands

```bash
# Run all tests
npm test

# Run tests with coverage report
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run tests with verbose output
npm run test:verbose

# Run specific test file
npm test -- tests/auth.test.js

# Run tests matching pattern
npm test -- --testNamePattern="authentication"
```

### Environment Configuration

Tests run in a separate environment with:

- NODE_ENV=test
- Separate test database connection
- Mocked external services
- Reduced logging output

## Test Configuration

### Jest Configuration (package.json)

```json
{
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
    "coverageReporters": ["text", "lcov", "html"]
  }
}
```

### Test Setup (tests/setup.js)

- Configures test environment
- Sets up database connections
- Mocks external services
- Increases timeout for async operations

## Test Utilities

### Test Helpers (tests/utils/testHelpers.js)

Provides reusable functions for:

- Generating test data with Faker.js
- Creating authenticated users
- Setting up test products
- JWT token generation
- Database cleanup utilities

**Key Functions:**
- `generateUserData()`: Creates realistic user data
- `createTestUser()`: Creates user in test database
- `createAuthenticatedUser()`: Creates user with JWT token
- `generateToken()`: Creates JWT tokens for testing

## Coverage Reports

### Coverage Metrics

The test suite tracks:

- Line coverage: Percentage of code lines executed
- Branch coverage: Percentage of code branches tested
- Function coverage: Percentage of functions called
- Statement coverage: Percentage of statements executed

### Coverage Thresholds

Minimum coverage requirements:
- Lines: 80%
- Branches: 75%
- Functions: 80%
- Statements: 80%

### Viewing Coverage

Coverage reports are generated in multiple formats:

```bash
# Generate coverage report
npm run test:coverage

# View HTML report
open coverage/lcov-report/index.html
```

## Best Practices

### Test Organization

1. **Descriptive Test Names**: Use clear, descriptive test names
2. **Grouped Tests**: Organize related tests in describe blocks
3. **Setup and Teardown**: Use beforeEach/afterEach for test isolation
4. **Async Testing**: Properly handle async operations with await

### Test Data Management

1. **Realistic Data**: Use Faker.js for realistic test data
2. **Data Isolation**: Each test should use fresh data
3. **Cleanup**: Clean up test data after each test
4. **Deterministic Tests**: Avoid random test failures

### Error Testing

1. **Positive Cases**: Test successful operations
2. **Negative Cases**: Test error conditions
3. **Edge Cases**: Test boundary conditions
4. **Validation**: Test input validation

## Troubleshooting

### Common Issues

1. **Database Connection**: Ensure test database is accessible
2. **Port Conflicts**: Use different ports for test environment
3. **Async Operations**: Properly await async operations
4. **Memory Leaks**: Clean up resources after tests

### Debug Mode

Run tests with debug information:

```bash
# Enable debug logging
DEBUG=* npm test

# Run with Node.js inspector
node --inspect-brk node_modules/.bin/jest

# Detect open handles
npm test -- --detectOpenHandles
```

## Continuous Integration

### CI Configuration

Tests are configured to run in CI environments:

- Automated test execution on code changes
- Coverage report generation
- Test result notifications
- Build failure on test failures

### Environment Variables

Required environment variables for testing:

```bash
NODE_ENV=test
JWT_SECRET=test-secret-key
MONGO_URI=mongodb://localhost:27017/test-db
```

## Maintenance

### Adding New Tests

When adding new features:

1. Create corresponding test files
2. Follow existing test patterns
3. Update coverage thresholds if needed
4. Document new test categories

### Updating Tests

When modifying existing features:

1. Update corresponding tests
2. Ensure backward compatibility
3. Maintain test coverage levels
4. Update documentation

## Performance

### Test Execution Time

- Individual tests should complete within 5 seconds
- Full test suite should complete within 2 minutes
- Use test timeouts to prevent hanging tests

### Resource Usage

- Monitor memory usage during tests
- Clean up database connections
- Avoid resource leaks in test code

## Security Testing

### Authentication Testing

- Token validation and expiration
- Role-based access control
- Input sanitization
- SQL injection prevention

### Authorization Testing

- Admin-only endpoint protection
- User data access restrictions
- Cross-user data access prevention
- Privilege escalation prevention
