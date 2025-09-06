const express = require('express');
const router = express.Router();
const { getCart, addItemToCart, removeItemFromCart, mergeCart } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getCart).post(protect, addItemToCart);
router.route('/merge').post(protect, mergeCart);
router.route('/:productId').delete(protect, removeItemFromCart);


module.exports = router;
