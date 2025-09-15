const express = require('express');
const Rating = require('../models/Rating');
const Store = require('../models/Store');
const User = require('../models/User');
const { authenticateToken, authorize } = require('../middleware/auth');
const { validate, ratingSchema } = require('../middleware/Validation');

const router = express.Router();

// Submit or update rating
router.post('/', authenticateToken, authorize('user'), validate(ratingSchema), async (req, res, next) => {
  try {
    const { storeId, rating, comment } = req.body;

    // Check if store exists
    const store = await Store.findById(storeId);
    if (!store || !store.isActive) {
      return res.status(404).json({ message: 'Store not found' });
    }

    // Check if user already rated this store
    const existingRating = await Rating.findOne({
      userId: req.user._id,
      storeId
    });

    if (existingRating) {
      // Update existing rating
      existingRating.rating = rating;
      if (comment !== undefined) existingRating.comment = comment;
      await existingRating.save();

      res.json({
        message: 'Rating updated successfully',
        rating: existingRating
      });
    } else {
      // Create new rating
      const newRating = new Rating({
        userId: req.user._id,
        storeId,
        rating,
        comment
      });

      await newRating.save();

      res.status(201).json({
        message: 'Rating submitted successfully',
        rating: newRating
      });
    }
  } catch (error) {
    next(error);
  }
});

// Get ratings for store owner's store
router.get('/store-ratings', authenticateToken, authorize('store_owner'), async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('storeId');
    if (!user.storeId) {
      return res.status(404).json({ message: 'Store not found for this owner' });
    }

    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    const skip = (page - 1) * limit;

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const ratings = await Rating.find({ storeId: user.storeId._id })
      .populate('userId', 'name email')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Rating.countDocuments({ storeId: user.storeId._id });

    res.json({
      ratings,
      store: user.storeId,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalRatings: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;