const axios = require("axios");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// Helper to generate JWT
const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Google Login
const googleLogin = async (req, res) => {
  const { access_token } = req.body;

  try {
    if (!access_token) {
      return res.status(400).json({ message: 'Missing access_token' });
    }

    const { data } = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const { email, name, picture } = data || {};
    if (!email) {
      return res.status(401).json({ message: 'Google did not return an email' });
    }

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name: name || email.split('@')[0],
        email,
        password: null,         // signals Google-only account
        profilePic: picture || null,
        provider: 'google',
      });
    }

    const token = generateToken(user._id);
    return res.json({ user, token });
  } catch (err) {
    console.error('Google auth failed:', err?.response?.data || err.message);
    return res.status(401).json({ message: 'Google authentication failed' });
  }
};

// Register
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    const token = generateToken(user._id);
    res.status(201).json({
      user: { _id: user._id, name: user.name, email: user.email },
      token,
    });
  } catch (error) {
    console.error("Register error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Login
const loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;

    // If someone accidentally sends { user: { email, password }, token }
    if (!email && req.body && typeof req.body.user === 'object') {
      email = req.body.user.email;
      password = req.body.user.password;
    }

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ message: 'Invalid payload' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (!user.password) {
      // This account is Google-only
      return res.status(401).json({ message: 'Please use Google login for this account' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);
    res.json({
      user: { _id: user._id, name: user.name, email: user.email, profilePic: user.profilePic },
      token,
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    // Populate wishlist with product details
    const user = await User.findById(req.user._id).populate('wishlist');
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        profilePic: user.profilePic,
        wishlist: user.wishlist,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Get profile error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Update profile
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = await bcrypt.hash(req.body.password, 10);
      }

      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        profilePic: updatedUser.profilePic,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Update profile error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Toggle wishlist
const toggleWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const productId = req.body.productId;
    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    const index = user.wishlist.findIndex(
      (item) => item.toString() === productId
    );

    if (index === -1) {
      // Add product to wishlist
      user.wishlist.push(productId);
    } else {
      // Remove product from wishlist
      user.wishlist.splice(index, 1);
    }

    await user.save();

    // Populate wishlist with product details before sending response
    await user.populate('wishlist');

    res.json(user);
  } catch (error) {
    console.error("Toggle wishlist error:", error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  googleLogin,
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  toggleWishlist,
};
