@echo off
echo Starting individual commits...

echo.
echo [0/12] Setting up .gitignore files...
echo # Dependencies > backend/.gitignore
echo node_modules/ >> backend/.gitignore
echo npm-debug.log* >> backend/.gitignore
echo yarn-debug.log* >> backend/.gitignore
echo yarn-error.log* >> backend/.gitignore
echo.
echo # Environment variables >> backend/.gitignore
echo .env >> backend/.gitignore
echo .env.local >> backend/.gitignore
echo .env.development.local >> backend/.gitignore
echo .env.test.local >> backend/.gitignore
echo .env.production.local >> backend/.gitignore
echo.
echo # Uploads and temporary files >> backend/.gitignore
echo uploads/ >> backend/.gitignore
echo temp/ >> backend/.gitignore
echo tmp/ >> backend/.gitignore
echo.
echo # Logs >> backend/.gitignore
echo logs/ >> backend/.gitignore
echo *.log >> backend/.gitignore
echo.
echo # Runtime data >> backend/.gitignore
echo pids >> backend/.gitignore
echo *.pid >> backend/.gitignore
echo *.seed >> backend/.gitignore
echo *.pid.lock >> backend/.gitignore
echo.
echo # Coverage directory used by tools like istanbul >> backend/.gitignore
echo coverage/ >> backend/.gitignore
echo .nyc_output >> backend/.gitignore
echo.
echo # Dependencies > frontend/.gitignore
echo node_modules/ >> frontend/.gitignore
echo /.pnp >> frontend/.gitignore
echo .pnp.js >> frontend/.gitignore
echo.
echo # Testing >> frontend/.gitignore
echo /coverage >> frontend/.gitignore
echo.
echo # Production >> frontend/.gitignore
echo /build >> frontend/.gitignore
echo /dist >> frontend/.gitignore
echo.
echo # Environment variables >> frontend/.gitignore
echo .env >> frontend/.gitignore
echo .env.local >> frontend/.gitignore
echo .env.development.local >> frontend/.gitignore
echo .env.test.local >> frontend/.gitignore
echo .env.production.local >> frontend/.gitignore
echo.
echo # Logs >> frontend/.gitignore
echo npm-debug.log* >> frontend/.gitignore
echo yarn-debug.log* >> frontend/.gitignore
echo yarn-error.log* >> frontend/.gitignore
echo.
echo # Runtime data >> frontend/.gitignore
echo lerna-debug.log* >> frontend/.gitignore
echo.
echo # Editor directories and files >> frontend/.gitignore
echo .vscode/ >> frontend/.gitignore
echo .idea >> frontend/.gitignore
echo *.swp >> frontend/.gitignore
echo *.swo >> frontend/.gitignore
echo *~ >> frontend/.gitignore
echo.
echo # OS generated files >> frontend/.gitignore
echo .DS_Store >> frontend/.gitignore
echo .DS_Store? >> frontend/.gitignore
echo ._* >> frontend/.gitignore
echo .Spotlight-V100 >> frontend/.gitignore
echo .Trashes >> frontend/.gitignore
echo ehthumbs.db >> frontend/.gitignore
echo Thumbs.db >> frontend/.gitignore

git add backend/.gitignore
git add frontend/.gitignore
git commit -m "config: add comprehensive .gitignore files

- Add backend .gitignore for Node.js, env files, uploads, logs
- Add frontend .gitignore for React, build files, dependencies
- Exclude sensitive files and build artifacts
- Prevent node_modules and .env files from being tracked"

echo.
echo [1/11] Committing Authentication & Authorization Fixes...
git add backend/src/middleware/authMiddleware.js
git add backend/src/routes/authRoutes.js
git add frontend/src/redux/slices/authSlice.js
git add frontend/src/services/api.js
git commit -m "fix: resolve authentication and authorization issues

- Fix token storage and retrieval in localStorage
- Update API interceptor to properly handle auth tokens
- Enhance auth middleware for better error handling
- Initialize token from userInfo on app startup"

echo.
echo [2/11] Committing Order Management System...
git add backend/src/controllers/orderController.js
git add backend/src/routes/orderRoutes.js
git add frontend/src/redux/slices/orderSlice.js
git add frontend/src/pages/admin/AdminOrdersPage.js
git commit -m "feat: enhance order management system

- Add updateOrderStatus endpoint for flexible status updates
- Fix route ordering to prevent ObjectId cast errors
- Add error handling for email service failures
- Improve admin order management interface"

echo.
echo [3/11] Committing User Management & SuperAdmin Features...
git add backend/src/routes/superadminRoutes.js
git add frontend/src/pages/superadmin/UserManagementPage.js
git add frontend/src/components/SuperAdminRoute.js
git add frontend/src/pages/SuperAdminDashboard.js
git commit -m "feat: implement superadmin user management system

- Add comprehensive user management for superadmins
- Create protected superadmin routes
- Implement user role management and admin creation
- Add user activation/deactivation functionality"

echo.
echo [4/11] Committing Product Management Enhancements...
git add backend/src/controllers/productController.js
git add frontend/src/redux/slices/productSlice.js
git add frontend/src/pages/AddProductPage.js
git commit -m "enhance: improve product management system

- Add better error handling for product operations
- Enhance product creation and editing workflows
- Improve product data validation and processing"

echo.
echo [5/11] Committing Cart & Review System Updates...
git add backend/src/controllers/cartController.js
git add backend/src/controllers/reviewController.js
git add backend/src/routes/cartRoutes.js
git add backend/src/routes/reviewRoutes.js
git add frontend/src/pages/CartPage.js
git commit -m "improve: enhance cart and review functionality

- Update cart management with better error handling
- Improve review system with enhanced validation
- Add better user feedback for cart operations"

echo.
echo [6/11] Committing UI/UX Component Updates...
git add frontend/src/components/ProductCard.js
git add frontend/src/components/Footer.js
git add frontend/src/App.js
git commit -m "ui: redesign product cards and improve footer visibility

- Replace Add to Cart button with cart icon
- Add wishlist and share icons to product cards
- Fix footer visibility issues on small screens
- Optimize card sizing for mobile devices
- Ensure consistent card heights across all pages"

echo.
echo [7/11] Committing Page Layout Optimizations...
git add frontend/src/pages/HomePage.js
git add frontend/src/pages/Home.js
git add frontend/src/pages/ProductsPage.js
git commit -m "responsive: optimize product grid layouts for mobile

- Standardize grid layouts across all product pages
- Improve mobile responsiveness with compact card design
- Ensure uniform card sizes and characteristics
- Optimize spacing for better mobile experience"

echo.
echo [8/11] Committing Navigation & Route Protection...
git add frontend/src/components/Navbar.js
git add frontend/src/components/AdminRoute.js
git add frontend/src/components/PrivateRoute.js
git add frontend/src/components/layouts/AdminLayout.js
git commit -m "security: enhance route protection and navigation

- Improve admin and private route protection
- Update navigation components for better UX
- Add proper role-based access control
- Enhance layout components for admin interface"

echo.
echo [9/11] Committing Product Detail & Related Components...
git add frontend/src/pages/ProductDetailsPage.js
git add frontend/src/components/ProductComparison.js
git add frontend/src/components/ProductReviewForm.js
git add frontend/src/components/RelatedProducts.js
git add frontend/src/components/SocialShare.js
git commit -m "feature: enhance product detail page and related components

- Improve product detail page functionality
- Add product comparison features
- Enhance review form with better validation
- Update related products display
- Improve social sharing capabilities"

echo.
echo [10/11] Committing Order & Admin Management...
git add frontend/src/pages/OrderDetailsPage.js
git add frontend/src/redux/slices/adminSlice.js
git commit -m "admin: improve order details and admin state management

- Enhance order details page with better information display
- Update admin slice for improved state management
- Add better error handling for admin operations"

echo.
echo [11/11] Committing Server & Configuration Updates...
git add backend/src/server.js
git add frontend/src/utils/api.js
git add frontend/tailwind.config.js
git commit -m "config: update server configuration and styling

- Improve server setup and middleware configuration
- Update API utility functions
- Enhance Tailwind configuration for better styling"

echo.
echo ================================
echo All commits completed successfully!
echo ================================
echo.
echo Summary of commits made:
echo   1. Authentication ^& Authorization Fixes
echo   2. Order Management System
echo   3. User Management ^& SuperAdmin Features
echo   4. Product Management Enhancements
echo   5. Cart ^& Review System Updates
echo   6. UI/UX Component Updates
echo   7. Page Layout Optimizations
echo   8. Navigation ^& Route Protection
echo   9. Product Detail ^& Related Components
echo   10. Order ^& Admin Management
echo   11. Server ^& Configuration Updates
echo.
echo Ready to push to origin!
echo Run: git push origin superAdminEndPoints
pause
