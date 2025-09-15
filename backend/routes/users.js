const express = require('express');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');
const { validate, passwordUpdateSchema } = require('../middleware/Validation');

const router = express.Router();

// Update password
router.put('/password', authenticateToken, validate(passwordUpdateSchema), async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;