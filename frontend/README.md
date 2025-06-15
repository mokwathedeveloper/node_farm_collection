# E-Commerce Frontend

A modern, responsive e-commerce frontend built with React and Next.js, featuring a clean design and comprehensive shopping functionality.

## Features

### User Experience
- **Responsive Design**: Mobile-first approach with seamless desktop experience
- **Modern UI**: Clean, intuitive interface with smooth animations
- **Fast Loading**: Optimized performance with Next.js and image optimization
- **Accessibility**: WCAG compliant with keyboard navigation support

### Shopping Features
- **Product Catalog**: Browse products with filtering and search
- **Product Details**: Detailed product pages with image galleries
- **Shopping Cart**: Add, remove, and manage cart items
- **Wishlist**: Save favorite products for later
- **User Reviews**: Read and write product reviews
- **Product Comparison**: Compare multiple products side by side

### User Management
- **Authentication**: Secure login and registration
- **User Profiles**: Manage personal information and preferences
- **Order History**: View past orders and track current ones
- **Address Management**: Save multiple shipping addresses
- **Account Settings**: Update profile, password, and preferences

### E-Commerce Functionality
- **Checkout Process**: Streamlined multi-step checkout
- **Payment Integration**: Multiple payment methods support
- **Order Tracking**: Real-time order status updates
- **Inventory Display**: Live stock information
- **Price Calculations**: Dynamic pricing with taxes and shipping

## Technology Stack

### Core Technologies
- **React 18**: Modern React with hooks and concurrent features
- **Next.js 14**: Full-stack React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework

### State Management
- **Redux Toolkit**: Predictable state management
- **React Query**: Server state management and caching
- **Context API**: Local component state sharing

### UI Components
- **Headless UI**: Accessible UI components
- **React Hook Form**: Performant form handling
- **Framer Motion**: Smooth animations and transitions
- **React Icons**: Comprehensive icon library

### Development Tools
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **Husky**: Git hooks for code quality
- **Jest**: Unit testing framework
- **Cypress**: End-to-end testing

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```

4. **Configure environment variables**
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key
   NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=your_ga_id
   ```

5. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open browser**
   Navigate to `http://localhost:3000`

## Available Scripts

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run type-check   # TypeScript type checking
```

### Testing
```bash
npm run test         # Run unit tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate coverage report
npm run e2e          # Run end-to-end tests
npm run e2e:headless # Run E2E tests headlessly
```

### Code Quality
```bash
npm run format       # Format code with Prettier
npm run analyze      # Analyze bundle size
npm run lighthouse   # Run Lighthouse audit
```

## Project Structure

```
frontend/
├── public/                 # Static assets
│   ├── images/            # Image assets
│   ├── icons/             # Icon files
│   └── favicon.ico        # Favicon
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── (auth)/        # Authentication routes
│   │   ├── (shop)/        # Shopping routes
│   │   ├── admin/         # Admin dashboard
│   │   ├── globals.css    # Global styles
│   │   └── layout.tsx     # Root layout
│   ├── components/        # Reusable components
│   │   ├── ui/            # Base UI components
│   │   ├── forms/         # Form components
│   │   ├── layout/        # Layout components
│   │   └── features/      # Feature-specific components
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility libraries
│   ├── store/             # Redux store configuration
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions
├── tests/                 # Test files
├── docs/                  # Documentation
└── config files          # Configuration files
```

## Key Features Implementation

### Authentication Flow
- JWT token-based authentication
- Persistent login with refresh tokens
- Protected routes and role-based access
- Social login integration ready

### Shopping Cart
- Local storage persistence
- Real-time inventory checking
- Cart synchronization across devices
- Guest checkout support

### Product Management
- Dynamic product filtering
- Search with autocomplete
- Category-based navigation
- Product recommendations

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimizations
- Touch-friendly interactions
- Accessible navigation

## Performance Optimizations

### Next.js Features
- **Image Optimization**: Automatic image optimization and lazy loading
- **Code Splitting**: Automatic code splitting for optimal loading
- **Static Generation**: Pre-rendered pages for better performance
- **API Routes**: Built-in API functionality

### Custom Optimizations
- **Bundle Analysis**: Regular bundle size monitoring
- **Lazy Loading**: Component and route-based lazy loading
- **Caching**: Intelligent caching strategies
- **CDN Integration**: Static asset delivery optimization

## Deployment

### Build Process
```bash
npm run build        # Create production build
npm run start        # Start production server
```

### Deployment Platforms
- **Vercel**: Recommended for Next.js applications
- **Netlify**: Static site deployment
- **AWS**: S3 + CloudFront for static hosting
- **Docker**: Containerized deployment

### Environment Configuration
- Development: `.env.local`
- Staging: `.env.staging`
- Production: `.env.production`

## Testing Strategy

### Unit Testing
- Component testing with React Testing Library
- Hook testing with custom test utilities
- Utility function testing
- Redux store testing

### Integration Testing
- API integration tests
- Form submission flows
- Authentication workflows
- Shopping cart functionality

### End-to-End Testing
- Complete user journeys
- Cross-browser testing
- Mobile device testing
- Performance testing

## Contributing

### Development Workflow
1. Create feature branch from `develop`
2. Implement changes with tests
3. Run quality checks
4. Submit pull request
5. Code review and merge

### Code Standards
- Follow TypeScript best practices
- Use ESLint and Prettier configurations
- Write comprehensive tests
- Document complex functionality
- Follow component naming conventions

## Browser Support

### Supported Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Mobile Support
- iOS Safari 14+
- Chrome Mobile 90+
- Samsung Internet 14+

## Troubleshooting

### Common Issues
- **Build Errors**: Check Node.js version and dependencies
- **API Connection**: Verify backend server is running
- **Environment Variables**: Ensure all required variables are set
- **Performance**: Use React DevTools Profiler for optimization

### Debug Mode
```bash
DEBUG=* npm run dev  # Enable debug logging
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Check the documentation in `/docs`
- Review the troubleshooting guide
- Contact the development team


