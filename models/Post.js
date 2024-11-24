const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  subredditId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subreddit', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: { type: String },
  upvotesCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Post', PostSchema);
