const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile,checkUsernameAvailability } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
router.get('/check-username/:username', checkUsernameAvailability);
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);
module.exports = router;