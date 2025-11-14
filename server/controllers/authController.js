// server/controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper function to create token and set cookie
const generateTokenAndSetCookie = (res, userId) => {
  // Create token
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  // Set token in a secure, HTTP-only cookie
  res.cookie('jwt', token, {
    httpOnly: true, // Prevents JavaScript access (XSS)
    secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
    sameSite: 'strict', // Prevents CSRF attacks
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    // 1. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, error: 'User already exists' });
    }

    // 2. Create new user
    // The .pre('save') hook in your User.js model will automatically hash the password
    const user = await User.create({
      username,
      email,
      password,
    });

    if (user) {
      // 3. Generate token and set cookie
      generateTokenAndSetCookie(res, user._id);

      res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          username: user.username,
          email: user.email,
        },
      });
    } else {
      res.status(400).json({ success: false, error: 'Invalid user data' });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * @desc    Auth user & get token (Login)
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // 1. Find user by email
    // We must .select('+password') because it's hidden in the model
    const user = await User.findOne({ email }).select('+password');

    // 2. Check if user exists and password matches
    // We use the .matchPassword() method from your User.js model
    if (user && (await user.matchPassword(password))) {
      // 3. Generate token and set cookie
      generateTokenAndSetCookie(res, user._id);

      res.status(200).json({
        success: true,
        data: {
          _id: user._id,
          username: user.username,
          email: user.email,
        },
      });
    } else {
      res.status(401).json({ success: false, error: 'Invalid email or password' });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * @desc    Logout user / clear cookie
 * @route   POST /api/auth/logout
 * @access  Public
 */
const logoutUser = (req, res) => {
  // The cookie is named 'jwt' (from our helper function)
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0), // Set to a past date to expire it
  });
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
};