const express = require('express');
const mongoose = require('mongoose');
const Comment = require('../models/Comment'); // Ensure this model exists
const Post = require('../models/Post'); // For validating post existence
const router = express.Router();

// Add a comment to a post
router.post('/:postId', async (req, res) => {
    const { postId } = req.params;
    const { userId, content } = req.body;

    try {
        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: 'Invalid userId format' });
        }
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ error: 'Invalid postId format' });
        }

        // Validate post existence
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Create and save the comment
        const comment = new Comment({
            postId: new mongoose.Types.ObjectId(postId),
            userId: new mongoose.Types.ObjectId(userId),
            content,
        });

        await comment.save();
        res.status(201).json(comment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all comments for a post
router.get('/:postId', async (req, res) => {
    const { postId } = req.params;

    try {
        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ error: 'Invalid postId format' });
        }

        // Retrieve all comments for the post
        const comments = await Comment.find({ postId: new mongoose.Types.ObjectId(postId) })
            .sort({ createdAt: -1 }); // Sort by newest first

        res.status(200).json(comments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;
