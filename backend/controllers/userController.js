const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      role: role || 'user',
      createdBy: req.user ? req.user._id : null,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Request OTP for login
// @route   POST /api/users/send-otp
// @access  Public
const requestOTP = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    // Generate 6 digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otpCode = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    await sendEmail({
      email: user.email,
      subject: 'Purple Merit - Your Login OTP',
      message: `Your login OTP is ${otp}. It will expire in 10 minutes.`,
    });

    res.json({ message: 'OTP sent to your email' });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify OTP & get token
// @route   POST /api/users/verify-otp
// @access  Public
const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email }).select('+otpCode +otpExpires');

    if (!user || user.otpCode !== otp || user.otpExpires < Date.now()) {
      res.status(401);
      throw new Error('Invalid or expired OTP');
    }

    // Clear OTP after successful verify
    user.otpCode = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};
// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.firstName = req.body.firstName || user.firstName;
      user.lastName = req.body.lastName || user.lastName;
      
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        role: updatedUser.role,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res, next) => {
  try {
    const pageSize = Number(req.query.pageSize) || 10;
    const page = Number(req.query.page) || 1;

    // Search query
    const keyword = req.query.keyword
      ? {
          $or: [
            { firstName: { $regex: req.query.keyword, $options: 'i' } },
            { lastName: { $regex: req.query.keyword, $options: 'i' } },
            { email: { $regex: req.query.keyword, $options: 'i' } },
          ],
        }
      : {};

    const count = await User.countDocuments({ ...keyword });
    const users = await User.find({ ...keyword })
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ createdAt: -1 })
      .populate('createdBy', 'firstName lastName')
      .populate('updatedBy', 'firstName lastName');

    res.json({
      users,
      page,
      pages: Math.ceil(count / pageSize),
      total: count,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('createdBy', 'firstName lastName')
      .populate('updatedBy', 'firstName lastName');

    if (user) {
      res.json(user);
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.firstName = req.body.firstName || user.firstName;
      user.lastName = req.body.lastName || user.lastName;
      user.email = req.body.email || user.email;
      user.role = req.body.role || user.role;
      user.isActive = req.body.isActive !== undefined ? req.body.isActive : user.isActive;
      user.updatedBy = req.user._id;

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        role: updatedUser.role,
        isActive: updatedUser.isActive,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      await user.deleteOne();
      res.json({ message: 'User removed' });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get user statistics
// @route   GET /api/v1/users/stats
// @access  Private/Admin
const getUserStats = async (req, res, next) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [total, active, admins, moderators, newThisMonth] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      User.countDocuments({ role: 'admin' }),
      User.countDocuments({ role: 'moderator' }),
      User.countDocuments({ createdAt: { $gte: startOfMonth } }),
    ]);

    // Get last 6 months registration counts for chart
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const start = new Date(date.getFullYear(), date.getMonth(), 1);
      const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      const count = await User.countDocuments({ createdAt: { $gte: start, $lte: end } });
      monthlyData.push({
        month: start.toLocaleString('default', { month: 'short' }),
        users: count,
      });
    }

    res.json({ total, active, admins, moderators, newThisMonth, monthlyData });
  } catch (error) {
    next(error);
  }
};

// @desc    Export users as CSV
// @route   GET /api/v1/users/export
// @access  Private/Admin
const exportUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .populate('createdBy', 'firstName lastName')
      .sort({ createdAt: -1 });

    const csvRows = [
      ['ID', 'First Name', 'Last Name', 'Email', 'Role', 'Status', 'Created At', 'Created By'],
      ...users.map((u) => [
        u._id,
        u.firstName,
        u.lastName,
        u.email,
        u.role,
        u.isActive ? 'Active' : 'Disabled',
        new Date(u.createdAt).toISOString().split('T')[0],
        u.createdBy ? `${u.createdBy.firstName} ${u.createdBy.lastName}` : 'Self-registered',
      ]),
    ];

    const csv = csvRows.map((r) => r.map(v => `"${v}"`).join(',')).join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="users-${Date.now()}.csv"`);
    res.send(csv);
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
};
