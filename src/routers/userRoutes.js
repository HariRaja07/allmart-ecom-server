const express = require('express');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const DeletedAccount = require('../models/DeletedAccount'); // Create a model for deleted accounts
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const wishlistController = require('../controllers/wishlistController');

const router = express.Router();

// Middleware to authenticate the user using JWT
const authenticate = async (req, res, next) => {
  const token = req.header('x-auth-token');  // Assuming token is sent in the headers
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify JWT
    req.user = decoded.id;  // Store the user ID from the token in the request
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

// Utility function to send OTP
const sendOtp = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is: ${otp}`,
  };

  await transporter.sendMail(mailOptions);
};

// Signup Route
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });

    if (user && user.isRegistered) {
      return res.status(400).json({ message: 'User already registered' });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date();
    otpExpires.setMinutes(otpExpires.getMinutes() + 15); // OTP expires in 15 minutes

    if (!user) {
      user = new User({ email, password, otp, otpExpires });
    } else {
      user.otp = otp;
      user.otpExpires = otpExpires;
    }

    await sendOtp(email, otp);
    await user.save();

    res.status(200).json({ message: 'OTP sent to email' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify OTP Route
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    if (user.otp !== otp || new Date() > user.otpExpires) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.isRegistered = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user || !user.isRegistered) {
      return res.status(400).json({ message: 'User not registered' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Protected Route to Get User Details
router.get('/details', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user);  // Fetch user using ID from token
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return user details excluding sensitive information like password
    res.status(200).json({
      email: user.email,
      isRegistered: user.isRegistered,
      name: user.name,
      phoneNumber: user.phoneNumber,
      address: user.address,
      // Add any other user details you'd like to return here
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Route to save user details
router.post('/save-details', authenticate, async (req, res) => {
  const { name, phoneNumber, address } = req.body;

  try {
    const user = await User.findById(req.user);
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    user.name = name || user.name;
    user.address = address || user.address;
    user.phoneNumber = phoneNumber || user.phoneNumber;

    await user.save();
    res.status(200).json({ message: 'Details saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route for forgot password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'Email not registered' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = Date.now() + 3600000; // 1 hour

    user.resetToken = resetToken;
    user.resetExpires = resetExpires;
    await user.save();

    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: user.email,
      subject: 'Password Reset',
      text: `Click the following link to reset your password: ${resetUrl}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Password reset email sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route for resetting password
router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetToken: token,
      resetExpires: { $gt: Date.now() }, // Check token validity
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    user.password = password; // Hashing is handled in `User` model's pre-save hook
    user.resetToken = undefined;
    user.resetExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete Account Route
router.post('/delete-account', authenticate, async (req, res) => {
  const { reason, password } = req.body;

  try {
    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password' });
    }

    // Save deleted account details in a new collection
    const deletedAccount = new DeletedAccount({
      email: user.email,
      reason,
      deletedAt: new Date(),
    });
    await deletedAccount.save();

    // Delete the user from the main users collection
    await User.findByIdAndDelete(req.user);

    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// --- Wishlist Routes ---

// Add product to wishlist
router.post('/wishlist/add', authenticate, wishlistController.addToWishlist);

// Remove product from wishlist
router.delete('/wishlist/remove', authenticate, wishlistController.removeFromWishlist);

// Get user's wishlist
router.get('/wishlist', authenticate, wishlistController.getUserWishlist);



module.exports = router;
