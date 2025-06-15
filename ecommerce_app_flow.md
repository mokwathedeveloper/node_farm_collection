# 🛍️ eCommerce App Flow – User & Admin Side (Markdown)

## 👤 User Flow

Launch App  
│  
├──> [Sign Up]  
│       ↓  
│    [Home Page]  
│  
├──> [Log In]  
│       ↓  
│    [Home Page]  
│  
└──> [Continue as Guest]  
        ↓  
    [Home Page]

From Home Page  
│  
├──> [Search / Browse Products]  
│       ↓  
│    [Apply Filters & Sorting]  
│       ↓  
│    [Product Detail Page]  
│       ├──> [Add to Wishlist]  
│       └──> [Add to Cart]  
│               ↓  
│           [Cart Page]  
│               ├──> [Edit / Remove Items]  
│               └──> [Proceed to Checkout]  
│                         ↓  
│                   [Shipping Address]  
│                         ↓  
│                   [Delivery Options]  
│                         ↓  
│                   [Payment Method]  
│                         ↓  
│                   [Review & Place Order]  
│                         ↓  
│                   [Order Confirmation]  
│                         ↓  
│                   [Track Order Status]  
│                         ↓  
│          ┌────────────┴─────────────┐  
│          ↓                          ↓  
│   [Return / Cancel Order]     [Order Complete]

Additional User Features  
│  
├──> [View Wishlist]  
├──> [Order History]  
├──> [Edit Profile & Settings]  
├──> [Manage Addresses]  
└──> [Manage Payment Methods]

---

## 🛠️ Admin Flow

[Admin Login]  
│  
└──> [Admin Dashboard]  
         │  
         ├──> [Manage Products]  
         │        ├── Add Product  
         │        ├── Edit Product  
         │        └── Delete Product  
         │  
         ├──> [Manage Orders]  
         │        ├── View Order Details  
         │        └── Update Order Status  
         │  
         ├──> [Manage Users]  
         │        └── View Users & Purchase History  
         │  
         ├──> [Promotions & Banners]  
         │        └── Create/Manage Sales Campaigns  
         │  
         ├──> [Returns & Refunds]  
         │        └── Approve/Reject Requests  
         │  
         └──> [Analytics & Reports]  
                  └── View Sales, Revenue, Traffic

