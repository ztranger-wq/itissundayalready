const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 }
});

const addressSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true, default: 'India' },
  phone: { type: String, required: true },
  isDefault: { type: Boolean, default: false }
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: function() { return !this.googleId; } }, // Password required only if not Google user
  googleId: { type: String, unique: true, sparse: true }, // Google ID for OAuth users
  phone: String,
  dateOfBirth: Date,
  gender: { type: String, enum: ['Male','Female','Other'] },
  cart: [cartItemSchema],
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  addresses: [addressSchema],
  preferences: {
    newsletter: { type: Boolean, default: true },
    smsNotifications: { type: Boolean, default: true },
    emailNotifications: { type: Boolean, default: true },
    currency: { type: String, default: 'INR' },
    language: { type: String, default: 'en' }
  },
  loyaltyPoints: { type: Number, default: 0 },
  membershipTier: { type: String, enum: ['Bronze','Silver','Gold','Platinum'], default: 'Bronze' },
  lastLogin: Date,
  isActive: { type: Boolean, default: true },
  passwordResetToken: String,
  passwordResetExpires: Date
}, { timestamps: true });

userSchema.methods.updateMembershipTier = async function() {
  const Order = require('./Order');
  const agg = await Order.aggregate([
    { $match: { user: this._id, isPaid: true } },
    { $group: { _id:null, total:{ $sum:'$totalPrice' } } }
  ]);
  const amount = agg[0]?.total||0;
  if (amount>=100000) this.membershipTier='Platinum';
  else if(amount>=50000) this.membershipTier='Gold';
  else if(amount>=25000) this.membershipTier='Silver';
  else this.membershipTier='Bronze';
  return this.save();
};

module.exports = mongoose.model('User', userSchema);
