# Node Farm Collection - E-Commerce Platform

A comprehensive, full-stack e-commerce platform built with modern web technologies. Features a robust Node.js backend API and a responsive React frontend, designed for scalability and performance.

## Project Overview

### What is Node Farm Collection?
A complete e-commerce solution that provides:
- **Product Management**: Comprehensive catalog with categories, inventory, and reviews
- **User Management**: Authentication, profiles, and role-based access control
- **Shopping Experience**: Cart, wishlist, checkout, and order management
- **Admin Dashboard**: Complete administrative control panel
- **Payment Processing**: Secure payment integration
- **Responsive Design**: Mobile-first, cross-platform compatibility

### Key Features
- **Full-Stack Architecture**: Separate frontend and backend for scalability
- **RESTful API**: Well-documented, secure API endpoints
- **Modern UI/UX**: Clean, intuitive user interface
- **Comprehensive Testing**: 100+ tests covering critical functionality
- **Production Ready**: Deployed and tested in production environments
- **Secure**: JWT authentication, input validation, and security middleware

## Technology Stack

### Backend (Node.js)
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens with bcrypt encryption
- **Validation**: Express-validator for input validation
- **Testing**: Jest with Supertest for API testing
- **Security**: Helmet, CORS, rate limiting
- **File Upload**: Multer with Cloudinary integration
- **Email**: Nodemailer for transactional emails

### Frontend (React)
- **Framework**: React 18 with Next.js 14
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS with responsive design
- **State Management**: Redux Toolkit with React Query
- **Forms**: React Hook Form with validation
- **Testing**: Jest with React Testing Library
- **UI Components**: Headless UI with custom components
- **Animations**: Framer Motion for smooth transitions

### DevOps & Tools
- **Version Control**: Git with GitHub
- **Package Management**: npm with workspaces
- **Code Quality**: ESLint, Prettier, Husky
- **Testing**: Comprehensive test suites
- **Documentation**: Detailed README files and API docs
- **Deployment**: Production-ready configuration

## Project Structure

```
node_farm_collection/
├── backend/                    # Node.js API server
│   ├── src/
│   │   ├── controllers/        # Route controllers
│   │   ├── models/            # Database models
│   │   ├── routes/            # API routes
│   │   ├── middleware/        # Custom middleware
│   │   ├── utils/             # Utility functions
│   │   └── config/            # Configuration files
│   ├── tests/                 # Test suites
│   ├── docs/                  # Backend documentation
│   └── package.json           # Backend dependencies
├── frontend/                   # React application
│   ├── src/
│   │   ├── app/               # Next.js App Router
│   │   ├── components/        # React components
│   │   ├── hooks/             # Custom hooks
│   │   ├── store/             # Redux store
│   │   └── utils/             # Frontend utilities
│   ├── public/                # Static assets
│   └── package.json           # Frontend dependencies
├── tests/                      # Integration tests
├── docs/                       # Project documentation
└── README.md                   # This file
```

## Quick Start

### Prerequisites
- **Node.js**: Version 18 or higher
- **MongoDB**: Local installation or MongoDB Atlas account
- **Git**: For version control
- **npm**: Package manager (comes with Node.js)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mokwathedeveloper/node_farm_collection.git
   cd node_farm_collection
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Configure your environment variables
   npm run dev
   ```

3. **Frontend Setup** (in a new terminal)
   ```bash
   cd frontend
   npm install
   cp .env.example .env.local
   # Configure your environment variables
   npm run dev
   ```

4. **Access the Application**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5000`
   - API Documentation: `http://localhost:5000/api-docs`

### Environment Configuration

#### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/node_farm_collection
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_name
```

## Available Scripts

### Backend Commands
```bash
npm run dev          # Start development server
npm run start        # Start production server
npm test             # Run test suite
npm run test:watch   # Run tests in watch mode
npm run lint         # Run ESLint
npm run build        # Build for production
```

### Frontend Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm test             # Run unit tests
npm run e2e          # Run end-to-end tests
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

### Root Level Commands
```bash
npm run install:all  # Install all dependencies
npm run dev:all      # Start both frontend and backend
npm run test:all     # Run all tests
npm run build:all    # Build both applications
```

## API Documentation

### Core Endpoints
- **Authentication**: `/api/auth/*` - Login, register, profile management
- **Products**: `/api/products/*` - Product CRUD operations
- **Users**: `/api/users/*` - User management
- **Orders**: `/api/orders/*` - Order processing
- **Cart**: `/api/cart/*` - Shopping cart operations
- **Reviews**: `/api/reviews/*` - Product reviews

### API Features
- **RESTful Design**: Standard HTTP methods and status codes
- **Authentication**: JWT-based authentication
- **Validation**: Comprehensive input validation
- **Error Handling**: Consistent error responses
- **Rate Limiting**: API abuse prevention
- **CORS**: Cross-origin resource sharing configured
- **Security**: Helmet.js security headers

## Testing

### Backend Testing
- **Unit Tests**: Individual function and method testing
- **Integration Tests**: API endpoint testing
- **Authentication Tests**: Security and token validation
- **Database Tests**: Model and query testing
- **Coverage**: 60-70% test coverage achieved

### Frontend Testing
- **Component Tests**: React component testing
- **Hook Tests**: Custom hook testing
- **Integration Tests**: Feature workflow testing
- **E2E Tests**: Complete user journey testing

### Running Tests
```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test

# Specific test suites (backend)
npm test tests/auth.test.js
npm test tests/final-working.test.js
```

## Deployment

### Production Deployment
- **Backend**: Node.js server with PM2 process manager
- **Frontend**: Static site generation with Next.js
- **Database**: MongoDB Atlas for production
- **CDN**: Cloudinary for image management
- **SSL**: HTTPS encryption for security

### Deployment Platforms
- **Backend**: Heroku, AWS EC2, DigitalOcean
- **Frontend**: Vercel, Netlify, AWS S3 + CloudFront
- **Database**: MongoDB Atlas, AWS DocumentDB

## Security Features

### Backend Security
- **Authentication**: JWT tokens with secure storage
- **Password Hashing**: bcrypt with salt rounds
- **Input Validation**: Express-validator sanitization
- **Rate Limiting**: API request throttling
- **CORS**: Configured cross-origin policies
- **Helmet**: Security headers middleware

### Frontend Security
- **XSS Protection**: Input sanitization
- **CSRF Protection**: Token-based protection
- **Secure Storage**: Secure token storage
- **Input Validation**: Client-side validation
- **HTTPS**: Secure data transmission

## Performance Optimizations

### Backend Optimizations
- **Database Indexing**: Optimized MongoDB queries
- **Caching**: Redis caching for frequent queries
- **Compression**: Gzip compression middleware
- **Image Optimization**: Cloudinary transformations

### Frontend Optimizations
- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: Next.js image optimization
- **Lazy Loading**: Component and route lazy loading
- **Bundle Analysis**: Regular bundle size monitoring

## Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Code Standards
- Follow ESLint and Prettier configurations
- Write comprehensive tests for new features
- Update documentation for API changes
- Use conventional commit messages
- Ensure all tests pass before submitting

## Troubleshooting

### Common Issues
- **Database Connection**: Ensure MongoDB is running
- **Port Conflicts**: Check if ports 3000/5000 are available
- **Environment Variables**: Verify all required variables are set
- **Dependencies**: Run `npm install` in both directories

### Getting Help
- Check the documentation in `/docs`
- Review the troubleshooting guides
- Create an issue in the repository
- Contact the development team

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with modern web technologies
- Inspired by best practices in e-commerce development
- Community contributions and feedback
- Open source libraries and frameworks

---

**A complete e-commerce solution built for the modern web**
