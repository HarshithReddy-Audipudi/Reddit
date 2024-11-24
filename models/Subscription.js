const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subredditId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subreddit', required: true },
  createdAt: { type: Date, default: Date.now },
});


module.exports = mongoose.model('Subscription', SubscriptionSchema);
