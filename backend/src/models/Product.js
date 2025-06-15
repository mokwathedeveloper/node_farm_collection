const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter product name'],
    trim: true,
    maxLength: [100, 'Product name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please enter product description'],
  },
  price: {
    type: Number,
    required: [true, 'Please enter product price'],
    maxLength: [8, 'Price cannot exceed 8 characters'],
    default: 0.0
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  category: {
    type: String,
    required: [true, 'Please select category for this product'],
    enum: {
      values: [
        'Electronics',
        'Cameras',
        'Laptops',
        'Accessories',
        'Headphones',
        'Food',
        'Books',
        'Clothes/Shoes',
        'Beauty/Health',
        'Sports',
        'Outdoor',
        'Home'
      ],
      message: 'Please select correct category for product'
    }
  },
  seller: {
    type: String,
    required: false,
    default: 'Store'
  },
  stock: {
    type: Number,
    required: [true, 'Please enter product stock'],
    maxLength: [5, 'Stock cannot exceed 5 characters'],
    default: 0
  },
  images: [
    {
      url: {
        type: String,
        required: true
      }
    }
  ],
  ratings: {
    type: Number,
    default: 0
  },
  numOfReviews: {
    type: Number,
    default: 0
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
      },
    name: {
        type: String,
        required: true
      },
      rating: {
        type: Number,
        required: true
      },
      comment: {
        type: String,
        required: true
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  specifications: {
    dimensions: {
      type: String,
      default: ''
    },
    weight: {
      type: String,
      default: ''
    },
    manufacturer: {
      type: String,
      default: ''
    },
    modelNumber: {
      type: String,
      default: ''
    },
    warranty: {
      type: String,
      default: ''
    }
    },
  features: [{
    type: String
  }],
  socialStats: {
    shares: {
      type: Number,
      default: 0
    },
    views: {
      type: Number,
      default: 0
    }
    },
  variants: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Product'
  }],
  relatedProducts: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Product'
  }],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
    },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

productSchema.methods.updateRating = function() {
  const avg = this.reviews.reduce((acc, review) => acc + review.rating, 0) / this.reviews.length;
  this.ratings = avg;
  return this.save();
};

productSchema.methods.incrementShares = function() {
  this.socialStats.shares += 1;
  return this.save();
};

productSchema.methods.incrementViews = function() {
  this.socialStats.views += 1;
  return this.save();
};

module.exports = mongoose.model('Product', productSchema);
