const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice, orderNotes } = req.body;
    if (!orderItems || orderItems.length === 0) return res.status(400).json({ message: 'No order items' });

    const populatedItems = await Promise.all(orderItems.map(async item => {
      const product = await Product.findById(item.product);
      if (!product) throw new Error(`Product not found: ${item.product}`);
      return {
        product: item.product,
        quantity: item.quantity,
        price: product.price,
        name: product.name,
        brand: product.brand,
        image: product.images[0] || ''
      };
    }));

    const order = new Order({
      user: req.user._id,
      orderItems: populatedItems,
      shippingAddress,
      paymentMethod,
      itemsPrice, shippingPrice, taxPrice, totalPrice, orderNotes,
      estimatedDelivery: new Date(Date.now() + 7*24*60*60*1000)
    });
    const savedOrder = await order.save();

    const user = await User.findById(req.user._id);
    user.cart = [];
    await user.save();

    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user','name email')
      .populate('orderItems.product','name images brand');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.user._id.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Forbidden' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page)||1;
    const limit = parseInt(req.query.limit)||10;
    const skip = (page-1)*limit;
    const orders = await Order.find({ user: req.user._id })
      .populate('orderItems.product','name images brand')
      .sort({ createdAt:-1 }).skip(skip).limit(limit);
    const total = await Order.countDocuments({ user: req.user._id });
    res.json({ orders, currentPage:page, totalPages:Math.ceil(total/limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.user.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Forbidden' });
    order.isPaid = true;
    order.paidAt = Date.now();
    order.orderStatus = 'Processing';
    order.paymentResult = req.body;
    const updated = await order.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.user.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Forbidden' });
    if (['Shipped','Delivered'].includes(order.orderStatus)) return res.status(400).json({ message: 'Cannot cancel' });
    order.orderStatus = 'Cancelled';
    const updated = await order.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getOrderStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const stats = await Order.aggregate([
      { $match:{ user:userId } },
      { $group:{ _id:'$orderStatus', count:{ $sum:1 }, total:{ $sum:'$totalPrice' } } }
    ]);
    const spent = await Order.aggregate([
      { $match:{ user:userId, isPaid:true } },
      { $group:{ _id:null, total:{ $sum:'$totalPrice' } } }
    ]);
    const recent = await Order.find({ user:userId })
      .populate('orderItems.product','name images')
      .sort({ createdAt:-1 }).limit(3);
    res.json({ statusBreakdown:stats, totalSpent:spent[0]?.total||0, recentOrders:recent });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Handle PineLabs payment success callback
const handlePaymentSuccess = async (req, res) => {
  try {
    const { orderId, transactionId, paymentStatus, paymentMethod } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.isPaid = true;
    order.paidAt = Date.now();
    order.orderStatus = 'Processing';
    order.paymentResult = {
      transactionId,
      paymentStatus,
      paymentMethod,
      gateway: 'PineLabs'
    };

    const updatedOrder = await order.save();
    res.json({ message: 'Payment processed successfully', order: updatedOrder });
  } catch (err) {
    console.error('Payment success handling error:', err);
    res.status(500).json({ message: err.message });
  }
};

// Handle PineLabs payment failure callback
const handlePaymentFailure = async (req, res) => {
  try {
    const { orderId, errorMessage, paymentStatus } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.orderStatus = 'Payment Failed';
    order.paymentResult = {
      errorMessage,
      paymentStatus,
      gateway: 'PineLabs'
    };

    const updatedOrder = await order.save();
    res.json({ message: 'Payment failure recorded', order: updatedOrder });
  } catch (err) {
    console.error('Payment failure handling error:', err);
    res.status(500).json({ message: err.message });
  }
};

// Create order for checkout (without clearing cart yet)
const createCheckoutOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, shippingMethod, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice, orderNotes } = req.body;
    if (!orderItems || orderItems.length === 0) return res.status(400).json({ message: 'No order items' });

    const populatedItems = await Promise.all(orderItems.map(async item => {
      const product = await Product.findById(item.product);
      if (!product) throw new Error(`Product not found: ${item.product}`);
      return {
        product: item.product,
        quantity: item.quantity,
        price: product.price,
        name: product.name,
        brand: product.brand,
        image: product.images[0] || ''
      };
    }));

    const order = new Order({
      user: req.user._id,
      orderItems: populatedItems,
      shippingAddress,
      shippingMethod,
      paymentMethod,
      itemsPrice, shippingPrice, taxPrice, totalPrice, orderNotes,
      estimatedDelivery: new Date(Date.now() + (shippingMethod === 'express' ? 2 : 7)*24*60*60*1000)
    });
    const savedOrder = await order.save();

    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createOrder, getOrderById, getMyOrders, updateOrderToPaid, cancelOrder, getOrderStats, handlePaymentSuccess, handlePaymentFailure, createCheckoutOrder };
