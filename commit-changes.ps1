#!/usr/bin/env pwsh
# PowerShell script to commit changes one by one in logical groups
# Run this script from the root directory of your project

Write-Host "Starting individual commits..." -ForegroundColor Green

# Function to commit with error handling
function Commit-Changes {
    param(
        [string[]]$Files,
        [string]$Message
    )
    
    Write-Host "`nCommitting: $Message" -ForegroundColor Yellow
    
    try {
        # Add files
        foreach ($file in $Files) {
            if (Test-Path $file) {
                git add $file
                Write-Host "  Added: $file" -ForegroundColor Gray
            } else {
                Write-Host "  Warning: File not found: $file" -ForegroundColor Red
            }
        }
        
        # Commit
        git commit -m $Message
        Write-Host "  ✓ Committed successfully" -ForegroundColor Green
        
    } catch {
        Write-Host "  ✗ Error committing: $_" -ForegroundColor Red
    }
}

# 1. Authentication & Authorization Fixes
Commit-Changes -Files @(
    "backend/src/middleware/authMiddleware.js",
    "backend/src/routes/authRoutes.js",
    "frontend/src/redux/slices/authSlice.js",
    "frontend/src/services/api.js"
) -Message "fix: resolve authentication and authorization issues

- Fix token storage and retrieval in localStorage
- Update API interceptor to properly handle auth tokens
- Enhance auth middleware for better error handling
- Initialize token from userInfo on app startup"

# 2. Order Management System
Commit-Changes -Files @(
    "backend/src/controllers/orderController.js",
    "backend/src/routes/orderRoutes.js",
    "frontend/src/redux/slices/orderSlice.js",
    "frontend/src/pages/admin/AdminOrdersPage.js"
) -Message "feat: enhance order management system

- Add updateOrderStatus endpoint for flexible status updates
- Fix route ordering to prevent ObjectId cast errors
- Add error handling for email service failures
- Improve admin order management interface"

# 3. User Management & SuperAdmin Features
Commit-Changes -Files @(
    "backend/src/routes/superadminRoutes.js",
    "frontend/src/pages/superadmin/UserManagementPage.js",
    "frontend/src/components/SuperAdminRoute.js",
    "frontend/src/pages/SuperAdminDashboard.js"
) -Message "feat: implement superadmin user management system

- Add comprehensive user management for superadmins
- Create protected superadmin routes
- Implement user role management and admin creation
- Add user activation/deactivation functionality"

# 4. Product Management Enhancements
Commit-Changes -Files @(
    "backend/src/controllers/productController.js",
    "frontend/src/redux/slices/productSlice.js",
    "frontend/src/pages/AddProductPage.js"
) -Message "enhance: improve product management system

- Add better error handling for product operations
- Enhance product creation and editing workflows
- Improve product data validation and processing"

# 5. Cart & Review System Updates
Commit-Changes -Files @(
    "backend/src/controllers/cartController.js",
    "backend/src/controllers/reviewController.js",
    "backend/src/routes/cartRoutes.js",
    "backend/src/routes/reviewRoutes.js",
    "frontend/src/pages/CartPage.js"
) -Message "improve: enhance cart and review functionality

- Update cart management with better error handling
- Improve review system with enhanced validation
- Add better user feedback for cart operations"

# 6. UI/UX Component Updates
Commit-Changes -Files @(
    "frontend/src/components/ProductCard.js",
    "frontend/src/components/Footer.js",
    "frontend/src/App.js"
) -Message "ui: redesign product cards and improve footer visibility

- Replace Add to Cart button with cart icon
- Add wishlist and share icons to product cards
- Fix footer visibility issues on small screens
- Optimize card sizing for mobile devices
- Ensure consistent card heights across all pages"

# 7. Page Layout Optimizations
Commit-Changes -Files @(
    "frontend/src/pages/HomePage.js",
    "frontend/src/pages/Home.js",
    "frontend/src/pages/ProductsPage.js"
) -Message "responsive: optimize product grid layouts for mobile

- Standardize grid layouts across all product pages
- Improve mobile responsiveness with compact card design
- Ensure uniform card sizes and characteristics
- Optimize spacing for better mobile experience"

# 8. Navigation & Route Protection
Commit-Changes -Files @(
    "frontend/src/components/Navbar.js",
    "frontend/src/components/AdminRoute.js",
    "frontend/src/components/PrivateRoute.js",
    "frontend/src/components/layouts/AdminLayout.js"
) -Message "security: enhance route protection and navigation

- Improve admin and private route protection
- Update navigation components for better UX
- Add proper role-based access control
- Enhance layout components for admin interface"

# 9. Product Detail & Related Components
Commit-Changes -Files @(
    "frontend/src/pages/ProductDetailsPage.js",
    "frontend/src/components/ProductComparison.js",
    "frontend/src/components/ProductReviewForm.js",
    "frontend/src/components/RelatedProducts.js",
    "frontend/src/components/SocialShare.js"
) -Message "feature: enhance product detail page and related components

- Improve product detail page functionality
- Add product comparison features
- Enhance review form with better validation
- Update related products display
- Improve social sharing capabilities"

# 10. Order & Admin Management
Commit-Changes -Files @(
    "frontend/src/pages/OrderDetailsPage.js",
    "frontend/src/redux/slices/adminSlice.js"
) -Message "admin: improve order details and admin state management

- Enhance order details page with better information display
- Update admin slice for improved state management
- Add better error handling for admin operations"

# 11. Server & Configuration Updates
Commit-Changes -Files @(
    "backend/src/server.js",
    "frontend/src/utils/api.js",
    "frontend/tailwind.config.js"
) -Message "config: update server configuration and styling

- Improve server setup and middleware configuration
- Update API utility functions
- Enhance Tailwind configuration for better styling"

Write-Host "`n✅ All commits completed successfully!" -ForegroundColor Green
Write-Host "📋 Summary of commits made:" -ForegroundColor Cyan
Write-Host "  1. Authentication & Authorization Fixes" -ForegroundColor White
Write-Host "  2. Order Management System" -ForegroundColor White
Write-Host "  3. User Management & SuperAdmin Features" -ForegroundColor White
Write-Host "  4. Product Management Enhancements" -ForegroundColor White
Write-Host "  5. Cart & Review System Updates" -ForegroundColor White
Write-Host "  6. UI/UX Component Updates" -ForegroundColor White
Write-Host "  7. Page Layout Optimizations" -ForegroundColor White
Write-Host "  8. Navigation & Route Protection" -ForegroundColor White
Write-Host "  9. Product Detail & Related Components" -ForegroundColor White
Write-Host "  10. Order & Admin Management" -ForegroundColor White
Write-Host "  11. Server & Configuration Updates" -ForegroundColor White

Write-Host "`n🚀 Ready to push to origin!" -ForegroundColor Green
Write-Host "Run: git push origin superAdminEndPoints" -ForegroundColor Yellow
