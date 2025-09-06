const express = require('express');
const router = express.Router();
const { getProducts, getProductById, createProductReview, deleteProductReview } = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/:id/reviews', protect, createProductReview);
router.delete('/:id/reviews/:reviewId', protect, deleteProductReview);

module.exports = router;
