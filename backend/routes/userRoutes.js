const express = require('express');
const router = express.Router();
const {
  registerUser,
  authUser,
  requestOTP,
  verifyOTP,
  getUserProfile,
  updateUserProfile,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserStats,
  exportUsers,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const {
  validateRegister,
  validateLogin,
  validateProfileUpdate,
  validateOTP,
} = require('../middleware/validationMiddleware');

// ─── Public Routes ────────────────────────────────────────────────────────────
router.post('/', validateRegister, registerUser);
router.post('/login', validateLogin, authUser);
router.post('/send-otp', validateOTP, requestOTP);
router.post('/verify-otp', verifyOTP);

// ─── Private Routes ───────────────────────────────────────────────────────────
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, validateProfileUpdate, updateUserProfile);

// ─── Admin Routes ─────────────────────────────────────────────────────────────
router.get('/stats', protect, authorize('admin'), getUserStats);
router.get('/export', protect, authorize('admin'), exportUsers);

router.route('/')
  .get(protect, authorize('admin'), getUsers);

router.route('/:id')
  .get(protect, authorize('admin'), getUserById)
  .put(protect, authorize('admin'), updateUser)
  .delete(protect, authorize('admin'), deleteUser);

module.exports = router;
