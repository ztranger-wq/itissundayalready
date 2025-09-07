const express = require("express");
const {
  googleLogin,
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  toggleWishlist,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  deleteAccount,
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

// Address routes (protected)
router.post("/profile/addresses", protect, addAddress);
router.put("/profile/addresses/:id", protect, updateAddress);
router.delete("/profile/addresses/:id", protect, deleteAddress);
router.put("/profile/addresses/:id/default", protect, setDefaultAddress);
router.delete("/profile", protect, deleteAccount);
module.exports = router;
