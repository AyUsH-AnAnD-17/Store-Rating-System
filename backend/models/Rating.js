const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating must not exceed 5']
  },
  comment: {
    type: String,
    maxlength: [500, 'Comment must not exceed 500 characters'],
    trim: true
  }
}, {
  timestamps: true
});

// Ensure one rating per user per store
ratingSchema.index({ userId: 1, storeId: 1 }, { unique: true });

// Update store average rating after save/update/delete
ratingSchema.post('save', async function() {
  await updateStoreRating(this.storeId);
});

ratingSchema.post('findOneAndUpdate', async function(doc) {
  if (doc) await updateStoreRating(doc.storeId);
});

ratingSchema.post('findOneAndDelete', async function(doc) {
  if (doc) await updateStoreRating(doc.storeId);
});

async function updateStoreRating(storeId) {
  const Store = mongoose.model('Store');
  const Rating = mongoose.model('Rating');
  
  const ratings = await Rating.find({ storeId });
  const totalRatings = ratings.length;
  const averageRating = totalRatings > 0 
    ? ratings.reduce((sum, rating) => sum + rating.rating, 0) / totalRatings 
    : 0;
  
  await Store.findByIdAndUpdate(storeId, {
    averageRating: parseFloat(averageRating.toFixed(2)),
    totalRatings
  });
}

module.exports = mongoose.model('Rating', ratingSchema);