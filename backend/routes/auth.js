const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @route   POST /api/auth/signup
// @desc    Register a new user
router.post('/signup', async (req, res) => {
  try {
    console.log('Request body:', req.body);
    const { name, phone, email, password, dob, membershipType, institutionSize } = req.body;

    // 1. name: min 3 characters
    if (!name || name.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Full name must be at least 3 characters.',
      });
    }

    // 2. phone: required + valid national number (digits after country code)
    const phoneStr = phone ? phone.trim() : '';
    // Extract country code prefix (+91, +1, etc.) and local number
    const phoneMatch = phoneStr.match(/^(\+\d{1,4})(\d{4,15})$/);
    if (!phoneStr || !phoneMatch) {
      return res.status(400).json({
        success: false,
        message: 'Enter a valid phone number with country code.',
      });
    }
    const fullPhone = phoneStr; // stored as-is e.g. +91XXXXXXXXXX

    // 3. phone uniqueness check (on full number including country code)
    const existingPhone = await User.findOne({ phone: fullPhone });
    if (existingPhone) {
      return res.status(409).json({
        success: false,
        message: 'This phone number is already registered.',
      });
    }

    // 4. email uniqueness check
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'This email is already registered.',
      });
    }

    // 5. dob: required + must be a valid past date
    if (!dob) {
      return res.status(400).json({
        success: false,
        message: 'Enter a valid date of birth.',
      });
    }
    const dobDate = new Date(dob);
    if (isNaN(dobDate.getTime()) || dobDate >= new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Enter a valid date of birth.',
      });
    }

    // 6. password: min 6 characters
    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters.',
      });
    }

    // 7. membershipType validation
    if (!membershipType) {
      return res.status(400).json({
        success: false,
        message: 'Please select a membership type.',
      });
    }

    if (membershipType === 'institutional' && !institutionSize) {
      return res.status(400).json({
        success: false,
        message: 'Institution size is required for institutional memberships',
      });
    }

    // Create new user — bcrypt hash kept exactly as is (salt 12)
    const hashedPassword = await bcrypt.hash(password, 12);
    console.log('Creating user with hashed password');
    const user = new User({
      name: name.trim(),
      phone: fullPhone,
      dob: dobDate,
      email,
      password: hashedPassword,
      membershipType,
      institutionSize: membershipType === 'institutional' ? institutionSize : undefined,
    });

    await user.save();
    console.log('User saved successfully');

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        membershipType: user.membershipType,
        institutionSize: user.institutionSize,
        isMembershipPaid: user.isMembershipPaid,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during signup',
    });
  }
});


// @route   POST /api/auth/login
// @desc    Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Find user and include password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        membershipType: user.membershipType,
        institutionSize: user.institutionSize,
        isMembershipPaid: user.isMembershipPaid,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user (protected route)
router.get('/me', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token, authorization denied',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Token is not valid',
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        membershipType: user.membershipType,
        institutionSize: user.institutionSize,
        isEmailVerified: user.isEmailVerified,
        isMembershipPaid: user.isMembershipPaid,
        membershipPaidAt: user.membershipPaidAt,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(401).json({
      success: false,
      message: 'Token is not valid',
    });
  }
});

module.exports = router;
