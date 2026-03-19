// models/Order.js
// Mongoose schema for Customer Orders

const mongoose = require('mongoose');

/**
 * Customer Order Schema
 * Contains customer information and order details
 */
const orderSchema = new mongoose.Schema(
  {
    // Customer Information
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    streetAddress: {
      type: String,
      required: [true, 'Street address is required'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    state: {
      type: String,
      required: [true, 'State/Province is required'],
      trim: true,
    },
    postalCode: {
      type: String,
      required: [true, 'Postal code is required'],
      trim: true,
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      enum: ['United States', 'Canada', 'Australia', 'Singapore', 'Hong Kong'],
    },

    // Order Information
    product: {
      type: String,
      required: [true, 'Product is required'],
      enum: [
        'Fiber Internet 300 Mbps',
        '5G Unlimited Mobile Plan',
        'Fiber Internet 1 Gbps',
        'Business Internet 500 Mbps',
        'VoIP Corporate Package',
      ],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
      default: 1,
    },
    unitPrice: {
      type: Number,
      required: [true, 'Unit price is required'],
      min: [0, 'Unit price cannot be negative'],
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed'],
      default: 'Pending',
    },
    createdBy: {
      type: String,
      required: [true, 'Created by is required'],
      enum: [
        'Mr. Michael Harris',
        'Mr. Ryan Cooper',
        'Ms. Olivia Carter',
        'Mr. Lucas Martin',
      ],
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Pre-save hook to calculate total amount
orderSchema.pre('save', function (next) {
  this.totalAmount = this.quantity * this.unitPrice;
  next();
});

// Pre-update hook to recalculate total amount
orderSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();
  if (update.quantity !== undefined || update.unitPrice !== undefined) {
    const quantity = update.quantity || this._update.quantity;
    const unitPrice = update.unitPrice || this._update.unitPrice;
    if (quantity && unitPrice) {
      update.totalAmount = quantity * unitPrice;
    }
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
