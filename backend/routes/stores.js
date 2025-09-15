const express = require('express');
const Store = require('../models/Store');
const Rating = require('../models/Rating');
const { authenticateToken, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all stores (for normal users)
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const { search, sortBy = 'name', sortOrder = 'asc', page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    let query = { isActive: true };

    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } }
      ];
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const stores = await Store.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('ownerId', 'name email');

    // Get user's ratings for these stores
    const storeIds = stores.map(store => store._id);
    const userRatings = await Rating.find({
      userId: req.user._id,
      storeId: { $in: storeIds }
    });

    const userRatingsMap = {};
    userRatings.forEach(rating => {
      userRatingsMap[rating.storeId.toString()] = rating;
    });

    // Add user rating to each store
    const storesWithUserRatings = stores.map(store => ({
      ...store.toJSON(),
      userRating: userRatingsMap[store._id.toString()] || null
    }));

    const total = await Store.countDocuments(query);

    res.json({
      stores: storesWithUserRatings,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalStores: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get store details
router.get('/:id', authenticateToken, async (req, res, next) => {
  try {
    const store = await Store.findById(req.params.id).populate('ownerId', 'name email');
    if (!store || !store.isActive) {
      return res.status(404).json({ message: 'Store not found' });
    }

    // Get user's rating for this store
    const userRating = await Rating.findOne({
      userId: req.user._id,
      storeId: store._id
    });

    res.json({
      store: {
        ...store.toJSON(),
        userRating
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;