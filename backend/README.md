# E-Commerce Backend API

A comprehensive Node.js/Express backend API for an e-commerce application with authentication, product management, order processing, and user administration.

## Features

- User authentication and authorization (JWT)
- Product management with search and filtering
- Shopping cart functionality
- Order processing and management
- User role management (Client, Admin, SuperAdmin)
- Review and rating system
- File upload handling
- Email notifications
- Comprehensive API testing suite

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **File Upload**: Multer
- **Email**: Nodemailer
- **Testing**: Jest + Supertest
- **Environment**: dotenv
- **Logging**: Custom middleware
- **Security**: Helmet, CORS

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Install development dependencies (for testing):
   ```bash
   npm install --save-dev jest supertest cross-env @faker-js/faker
   ```
4. Create a `.env` file with your environment variables:
   ```bash
   NODE_ENV=development
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   EMAIL_HOST=your_email_host
   EMAIL_PORT=587
   EMAIL_USER=your_email_user
   EMAIL_PASS=your_email_password
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/setup-superadmin` - Setup initial superadmin
- `GET /api/auth/check-superadmin` - Check if superadmin exists

### Products
- `GET /api/products` - Get all products (with filtering, search, pagination)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)
- `GET /api/products/featured` - Get featured products

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/myorders` - Get user's orders
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id/status` - Update order status (Admin only)
- `PUT /api/orders/:id/cancel` - Cancel order
- `GET /api/orders/admin` - Get all orders (Admin only)

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:productId` - Update cart item
- `DELETE /api/cart/:productId` - Remove item from cart

### User Management (SuperAdmin only)
- `GET /api/superadmin/users` - Get all users
- `PUT /api/superadmin/users/:id/role` - Update user role
- `PUT /api/superadmin/users/:id/status` - Update user status
- `DELETE /api/users/:id` - Delete user
- `POST /api/auth/superadmin/create-admin` - Create admin user

### Reviews
- `POST /api/products/:id/reviews` - Create product review
- `GET /api/products/:id/reviews` - Get product reviews
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

## Testing

### Running Tests

The backend includes a comprehensive test suite using Jest and Supertest.

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
```

### Test Categories

- **Authentication Tests**: User registration, login, profile management
- **Product Tests**: CRUD operations, search, filtering, pagination
- **Order Tests**: Order creation, status updates, admin management
- **User Management Tests**: SuperAdmin operations, role management
- **Cart Tests**: Shopping cart functionality, guest and authenticated users
- **Middleware Tests**: Authentication, authorization, error handling

### Test Documentation

- [Testing Guide](docs/TESTING.md) - Comprehensive testing documentation
- [API Testing Guide](docs/API_TESTING_GUIDE.md) - API endpoint testing scenarios
- [Test Results](docs/TEST_RESULTS.md) - Latest test execution results

### Test Coverage

The test suite maintains high coverage across:
- Line coverage: 80%+
- Branch coverage: 75%+
- Function coverage: 80%+
- Statement coverage: 80%+

## Project Structure

```
backend/
├── src/
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── utils/             # Utility functions
│   └── server.js          # Main server file
├── tests/                 # Test files
│   ├── utils/             # Test utilities
│   └── *.test.js          # Test suites
├── docs/                  # Documentation
├── uploads/               # File uploads
└── package.json           # Dependencies and scripts
```

## Scripts

```bash
npm start              # Start production server
npm run dev            # Start development server with nodemon
npm test               # Run test suite
npm run test:coverage  # Run tests with coverage
npm run test:watch     # Run tests in watch mode
npm run test:verbose   # Run tests with verbose output
```

## Environment Variables

Required environment variables:

```bash
NODE_ENV=development|production|test
PORT=5000
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_secret_key
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
SUPER_ADMIN_SETUP_KEY=your_setup_key
```

## Authentication & Authorization

### User Roles

1. **Client**: Regular users who can browse products, place orders
2. **Admin**: Can manage products, view all orders, update order status
3. **SuperAdmin**: Full system access, can manage users and admins

### JWT Token Structure

```javascript
{
  "id": "user_id",
  "iat": 1234567890,
  "exp": 1234567890
}
```

### Protected Routes

- **Authentication Required**: Most endpoints require valid JWT token
- **Admin Required**: Product management, order administration
- **SuperAdmin Required**: User management, system administration

## Error Handling

The API uses consistent error response format:

```javascript
{
  "message": "Error description",
  "stack": "Error stack (development only)"
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Database Schema

### User Model
- Authentication information
- Role-based permissions
- Profile data
- Account status

### Product Model
- Product information
- Pricing and inventory
- Categories and tags
- Images and descriptions

### Order Model
- Order items and quantities
- Shipping information
- Payment details
- Order status tracking

### Cart Model
- User cart items
- Guest cart support
- Quantity management
- Price calculations

## Security Features

- JWT token authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS configuration
- Rate limiting
- Helmet security headers
- Environment variable protection

## Development

### Adding New Features

1. Create model in `src/models/`
2. Add controller in `src/controllers/`
3. Define routes in `src/routes/`
4. Add middleware if needed
5. Write tests in `tests/`
6. Update documentation

### Code Style

- Use ES6+ features
- Follow RESTful API conventions
- Implement proper error handling
- Add comprehensive comments
- Write tests for new features

## Deployment

### Production Setup

1. Set NODE_ENV=production
2. Configure production database
3. Set secure JWT secret
4. Configure email service
5. Set up file storage
6. Enable logging
7. Configure reverse proxy

### Environment Configuration

Ensure all required environment variables are set for production deployment.

## Contributing

1. Fork the repository
2. Create feature branch
3. Write tests for new features
4. Ensure all tests pass
5. Submit pull request

## License

This project is licensed under the MIT License.
