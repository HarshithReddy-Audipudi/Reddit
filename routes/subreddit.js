const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Subreddit = require('../models/Subreddit');
const Subscription = require('../models/Subscription');
const Post = require('../models/Post');



// Get Subreddit Timeline
router.get('/:subredditId/posts', async (req, res) => {
  const { subredditId } = req.params;
  const { limit = 10, offset = 0 } = req.query;
  try {
    const posts = await Post.find({ subredditId })
      .sort({ createdAt: -1 })
      .skip(Number(offset))
      .limit(Number(limit));
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Subscribe to Subreddit
router.post('/:subredditId/subscribe', async (req, res) => {
  const { subredditId } = req.params;
  const { userId } = req.body;

  try {
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: 'Invalid userId format' });
    }
    if (!mongoose.Types.ObjectId.isValid(subredditId)) {
        return res.status(400).json({ error: 'Invalid subredditId format' });
    }

    // Convert to ObjectId using `new`
    const subscription = new Subscription({
        userId: new mongoose.Types.ObjectId(userId),
        subredditId: new mongoose.Types.ObjectId(subredditId),
    });

    await subscription.save();
    res.status(201).json(subscription);
} catch (err) {
    res.status(500).json({ error: err.message });
}

});

module.exports = router;
