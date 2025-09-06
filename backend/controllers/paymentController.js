const Order = require('../models/Order');

// Handle PineLabs webhook for payment status updates
const handlePineLabsWebhook = async (req, res) => {
  try {
    const { order_id, transaction_id, status, payment_method, amount, currency } = req.body;

    console.log('PineLabs Webhook received:', req.body);

    const order = await Order.findById(order_id);
    if (!order) {
      console.error('Order not found for webhook:', order_id);
      return res.status(404).json({ message: 'Order not found' });
    }

    if (status === 'success' || status === 'SUCCESS') {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.orderStatus = 'Processing';
      order.paymentResult = {
        transactionId: transaction_id,
        paymentStatus: status,
        paymentMethod: payment_method,
        amount,
        currency,
        gateway: 'PineLabs'
      };
    } else if (status === 'failed' || status === 'FAILED') {
      order.orderStatus = 'Payment Failed';
      order.paymentResult = {
        transactionId: transaction_id,
        paymentStatus: status,
        paymentMethod: payment_method,
        amount,
        currency,
        gateway: 'PineLabs'
      };
    } else {
      // Handle other statuses like pending, cancelled, etc.
      order.paymentResult = {
        transactionId: transaction_id,
        paymentStatus: status,
        paymentMethod: payment_method,
        amount,
        currency,
        gateway: 'PineLabs'
      };
    }

    await order.save();

    // If payment successful, clear user's cart
    if (order.isPaid) {
      const User = require('../models/User');
      const user = await User.findById(order.user);
      if (user) {
        user.cart = [];
        await user.save();
      }
    }

    res.status(200).json({ message: 'Webhook processed successfully' });
  } catch (err) {
    console.error('PineLabs webhook error:', err);
    res.status(500).json({ message: 'Webhook processing failed' });
  }
};

// Handle PineLabs redirect after payment
const handlePineLabsRedirect = async (req, res) => {
  try {
    const { order_id, status, transaction_id } = req.query;

    const order = await Order.findById(order_id);
    if (!order) {
      return res.status(404).send('Order not found');
    }

    if (status === 'success') {
      // Redirect to success page
      res.redirect(`${process.env.FRONTEND_URL}/checkout/success?orderId=${order_id}`);
    } else {
      // Redirect to payment page with error
      res.redirect(`${process.env.FRONTEND_URL}/checkout/payment?orderId=${order_id}&error=payment_failed`);
    }
  } catch (err) {
    console.error('PineLabs redirect error:', err);
    res.status(500).send('Redirect processing failed');
  }
};

module.exports = { handlePineLabsWebhook, handlePineLabsRedirect };
