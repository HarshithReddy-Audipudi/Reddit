const mongoose = require('mongoose');

const SubredditSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Subreddit', SubredditSchema);