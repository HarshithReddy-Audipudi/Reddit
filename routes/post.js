const express = require('express');
const router = express.Router();
const Subreddit = require('../models/Subreddit');
const Subscription = require('../models/Subscription');
const Post = require('../models/Post');
const Upvote = require('../models/Upvote');
const mongoose = require('mongoose');

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


// Submit a post to a subreddit
router.post('/:subredditId/posts', async (req, res) => {
  const { subredditId } = req.params;
  const { userId, title, content } = req.body;

  try {
      // Validate ObjectId format
      if (!mongoose.Types.ObjectId.isValid(userId)) {
          return res.status(400).json({ error: 'Invalid userId format' });
      }
      if (!mongoose.Types.ObjectId.isValid(subredditId)) {
          return res.status(400).json({ error: 'Invalid subredditId format' });
      }

      // Create the post
      const post = new Post({
          subredditId: new mongoose.Types.ObjectId(subredditId),
          userId: new mongoose.Types.ObjectId(userId),
          title,
          content,
      });

      await post.save();
      res.status(201).json(post);
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});

// Upvote a post
router.post('/:postId/upvote', async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.body;

  try {
      // Validate ObjectId format
      if (!mongoose.Types.ObjectId.isValid(userId)) {
          return res.status(400).json({ error: 'Invalid userId format' });
      }
      if (!mongoose.Types.ObjectId.isValid(postId)) {
          return res.status(400).json({ error: 'Invalid postId format' });
      }

      // Check if the user already upvoted the post
      const existingUpvote = await Upvote.findOne({ userId, postId });
      if (existingUpvote) {
          return res.status(400).json({ error: 'User has already upvoted this post' });
      }

      // Create a new upvote
      const upvote = new Upvote({
          userId: new mongoose.Types.ObjectId(userId),
          postId: new mongoose.Types.ObjectId(postId),
      });

      // Increment the upvotes count on the post
      await Post.findByIdAndUpdate(postId, { $inc: { upvotesCount: 1 } });

      // Save the upvote
      await upvote.save();
      res.status(201).json(upvote);
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});


module.exports = router;
