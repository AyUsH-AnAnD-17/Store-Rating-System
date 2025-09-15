const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Store name is required'],
    minlength: [20, 'Store name must be at least 20 characters'],
    maxlength: [60, 'Store name must not exceed 60 characters'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Store email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  address: {
    type: String,
    required: [true, 'Store address is required'],
    maxlength: [400, 'Address must not exceed 400 characters'],
    trim: true
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalRatings: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for search functionality
storeSchema.index({ name: 1, address: 1 });

module.exports = mongoose.model('Store', storeSchema);