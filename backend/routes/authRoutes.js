const express = require("express");
const {
  googleLogin,
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  toggleWishlist,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Auth routes
router.post("/google", googleLogin);
router.post("/register", registerUser);
router.post("/login", loginUser);

// User routes (protected)
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.put("/profile/wishlist", protect, toggleWishlist);

module.exports = router;
