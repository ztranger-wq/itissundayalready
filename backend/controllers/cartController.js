const User = require('../models/User');

exports.getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('cart.product');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.cart || []);
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.addItemToCart = async (req, res) => {
  const { productId, quantity, customizationOptions } = req.body;

  if (!productId || !quantity || quantity < 1) {
    return res.status(400).json({ message: 'Invalid product ID or quantity' });
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const itemIndex = user.cart.findIndex(p => p.product.toString() === productId);

    if (itemIndex > -1) {
      user.cart[itemIndex].quantity = quantity;
      user.cart[itemIndex].customizationOptions = customizationOptions;
    } else {
      user.cart.push({ product: productId, quantity, customizationOptions });
    }

    await user.save();
    const populatedUser = await User.findById(req.user._id).populate('cart.product');
    res.status(201).json(populatedUser.cart || []);
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.removeItemFromCart = async (req, res) => {
  const { productId } = req.params;

  if (!productId) {
    return res.status(400).json({ message: 'Product ID is required' });
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.cart = user.cart.filter(p => p.product.toString() !== productId);

    await user.save();
    const populatedUser = await User.findById(req.user._id).populate('cart.product');
    res.json(populatedUser.cart || []);
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.mergeCart = async (req, res) => {
  const { guestCart } = req.body;

  if (!guestCart || guestCart.length === 0) {
    return res.status(200).json({ message: "No guest cart to merge." });
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    guestCart.forEach(guestItem => {
      const itemIndex = user.cart.findIndex(
        userItem => userItem.product.toString() === guestItem.product._id
      );

      if (itemIndex > -1) {
        // Sum up quantities instead of replacing
        user.cart[itemIndex].quantity += guestItem.quantity;
      } else {
        user.cart.push({ product: guestItem.product._id, quantity: guestItem.quantity });
      }
    });

    await user.save();
    const populatedUser = await User.findById(req.user._id).populate('cart.product');
    res.json(populatedUser.cart || []);

  } catch (error) {
    console.error("Merge cart error:", error);
    res.status(500).json({ message: 'Server Error during cart merge', error: error.message });
  }
};
