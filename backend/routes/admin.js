const express = require('express');
const User = require('../models/User');
const Store = require('../models/Store');
const Rating = require('../models/Rating');
const { authenticateToken, authorize } = require('../middleware/auth');
const { validate, userRegistrationSchema, storeSchema } = require('../middleware/Validation');

const router = express.Router();

// Dashboard statistics
router.get('/dashboard', authenticateToken, authorize('admin'), async (req, res, next) => {
  try {
    const [totalUsers, totalStores, totalRatings] = await Promise.all([
      User.countDocuments({ isActive: true }),
      Store.countDocuments({ isActive: true }),
      Rating.countDocuments()
    ]);

    res.json({
      totalUsers,
      totalStores,
      totalRatings
    });
  } catch (error) {
    next(error);
  }
});

// Create new user (admin or normal user)
router.post('/users', authenticateToken, authorize('admin'), validate(userRegistrationSchema), async (req, res, next) => {
  try {
    const { name, email, address, password, role = 'user' } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const user = new User({
      name,
      email,
      address,
      password,
      role: ['admin', 'user'].includes(role) ? role : 'user'
    });

    await user.save();

    res.status(201).json({
      message: 'User created successfully',
      user
    });
  } catch (error) {
    next(error);
  }
});

// Create new store
router.post('/stores', authenticateToken, authorize('admin'), validate(storeSchema), async (req, res, next) => {
  try {
    const { name, email, address, ownerName, ownerEmail, ownerAddress, ownerPassword } = req.body;

    // Check if store email already exists
    const existingStore = await Store.findOne({ email });
    if (existingStore) {
      return res.status(400).json({ message: 'Store already exists with this email' });
    }

    // Check if owner email already exists
    const existingOwner = await User.findOne({ email: ownerEmail });
    if (existingOwner) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create store owner
    const owner = new User({
      name: ownerName,
      email: ownerEmail,
      address: ownerAddress,
      password: ownerPassword,
      role: 'store_owner'
    });

    await owner.save();

    // Create store
    const store = new Store({
      name,
      email,
      address,
      ownerId: owner._id
    });

    await store.save();

    // Update owner with store reference
    owner.storeId = store._id;
    await owner.save();

    res.status(201).json({
      message: 'Store and owner created successfully',
      store,
      owner: {
        id: owner._id,
        name: owner.name,
        email: owner.email,
        role: owner.role
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get all users
router.get('/users', authenticateToken, authorize('admin'), async (req, res, next) => {
  try {
    const { 
      search, 
      role, 
      sortBy = 'name', 
      sortOrder = 'asc', 
      page = 1, 
      limit = 10 
    } = req.query;
    
    const skip = (page - 1) * limit;

    let query = { isActive: true };

    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } }
      ];
    }

    // Role filter
    if (role && ['admin', 'user', 'store_owner'].includes(role)) {
      query.role = role;
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const users = await User.find(query)
      .populate('storeId', 'name averageRating')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.json({
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalUsers: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get all stores
router.get('/stores', authenticateToken, authorize('admin'), async (req, res, next) => {
  try {
    const { 
      search, 
      sortBy = 'name', 
      sortOrder = 'asc', 
      page = 1, 
      limit = 10 
    } = req.query;
    
    const skip = (page - 1) * limit;

    let query = { isActive: true };

    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } }
      ];
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const stores = await Store.find(query)
      .populate('ownerId', 'name email')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Store.countDocuments(query);

    res.json({
      stores,
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

// Get user details
router.get('/users/:id', authenticateToken, authorize('admin'), async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).populate('storeId', 'name averageRating');
    if (!user || !user.isActive) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    next(error);
  }
});

// Get store details
router.get('/stores/:id', authenticateToken, authorize('admin'), async (req, res, next) => {
  try {
    const store = await Store.findById(req.params.id).populate('ownerId', 'name email');
    if (!store || !store.isActive) {
      return res.status(404).json({ message: 'Store not found' });
    }

    // Get recent ratings for this store
    const recentRatings = await Rating.find({ storeId: store._id })
      .populate('userId', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({ 
      store,
      recentRatings 
    });
  } catch (error) {
    next(error);
  }
});

// Delete user (soft delete)
router.delete('/users/:id', authenticateToken, authorize('admin'), async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Don't allow deleting other admins
    if (user.role === 'admin' && user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Cannot delete other admin users' });
    }

    user.isActive = false;
    await user.save();

    // If it's a store owner, also deactivate the store
    if (user.role === 'store_owner' && user.storeId) {
      await Store.findByIdAndUpdate(user.storeId, { isActive: false });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// Delete store (soft delete)
router.delete('/stores/:id', authenticateToken, authorize('admin'), async (req, res, next) => {
  try {
    const store = await Store.findById(req.params.id);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    store.isActive = false;
    await store.save();

    // Also deactivate the store owner
    await User.findByIdAndUpdate(store.ownerId, { isActive: false });

    res.json({ message: 'Store deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;