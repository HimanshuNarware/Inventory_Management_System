/** @format */

const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: [true, 'User ID is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      minlength: [2, 'Product name must be at least 2 characters long'],
    },
    manufacturer: {
      type: String,
      required: [true, 'Manufacturer is required'],
      trim: true,
    },
    stock: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      default: 0,
      min: [0, 'Stock cannot be negative'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: String,
      trim: true,
      default: 'Uncategorized',
    },
    price: {
      type: Number,
      default: 0,
      min: [0, 'Price cannot be negative'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Add a virtual for formatted creation date
ProductSchema.virtual('createdAtFormatted').get(function () {
  return this.createdAt ? this.createdAt.toLocaleDateString() : '';
});

// Add a virtual for formatted update date
ProductSchema.virtual('updatedAtFormatted').get(function () {
  return this.updatedAt ? this.updatedAt.toLocaleDateString() : '';
});

const Product = mongoose.model('product', ProductSchema);
module.exports = Product;
