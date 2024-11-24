const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Subscription = require('../models/Subscription');
const Upvote = require('../models/Upvote');
const Post = require('../models/Post');
// Get User Profile

router.get('/:userId/profile', async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch user information
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch subreddits the user is subscribed to
    const subscriptions = await Subscription.find({ userId }).populate('subredditId');
    const subscribedSubreddits = subscriptions.map((sub) => sub.subredditId);

    // Fetch total upvotes received by the user
    const userPosts = await Post.find({ userId });
    const postIds = userPosts.map((post) => post._id);

    const upvotes = await Upvote.find({ postId: { $in: postIds } });
    const totalUpvotesReceived = upvotes.length;

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      subscribedSubreddits,
      totalUpvotesReceived,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
