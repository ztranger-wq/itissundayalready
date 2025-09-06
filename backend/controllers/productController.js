const Product = require('../models/Product');

exports.getProducts = async (req, res) => {
  const { brand, category, search, limit, sort } = req.query;
  const filter = {};

  if (brand) filter.brand = brand;
  if (category) filter.category = category;
  if (search) {
    filter.name = { $regex: search, $options: 'i' }; // Case-insensitive search
  }

  try {
    let query = Product.find(filter);

    if (sort) {
      if (sort === 'price-asc') {
        query = query.sort({ price: 1 });
      } else if (sort === 'price-desc') {
        query = query.sort({ price: -1 });
      } else if (sort === 'rating-desc') {
        query = query.sort({ rating: -1 });
      }
    } else {
      query = query.sort({ createdAt: -1 }); // Default sort by newest
    }

    if (limit) {
      query = query.limit(parseInt(limit));
    }
    const products = await query.exec();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.createProductReview = async (req, res) => {
  const { rating, comment } = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        return res.status(400).json({ message: 'Product already reviewed' });
      }

      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

      await product.save();
      res.status(201).json({ message: 'Review added' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.deleteProductReview = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      const review = product.reviews.find(
        (r) => r._id.toString() === req.params.reviewId
      );

      if (review) {
        // Check if the review belongs to the current user
        if (review.user.toString() !== req.user._id.toString()) {
          return res.status(401).json({ message: 'Not authorized to delete this review' });
        }

        product.reviews = product.reviews.filter(
          (r) => r._id.toString() !== req.params.reviewId
        );

        product.numReviews = product.reviews.length;
        product.rating = product.reviews.length > 0
          ? product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length
          : 0;

        await product.save();
        res.json({ message: 'Review deleted' });
      } else {
        res.status(404).json({ message: 'Review not found' });
      }
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
