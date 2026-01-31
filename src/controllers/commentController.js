const mongoose = require("mongoose");
const Comment = require("../models/Comment");
const Post = require("../models/Post");

exports.getCommentsForPost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    if (!mongoose.isValidObjectId(postId)) return res.status(400).json({ error: "invalid post id" });

    const comments = await Comment.find({ post: postId })
      .populate("author", "email role")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (err) {
    next(err);
  }
};

exports.createCommentForPost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    if (!mongoose.isValidObjectId(postId)) return res.status(400).json({ error: "invalid post id" });

    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "text is required" });

    const postExists = await Post.exists({ _id: postId });
    if (!postExists) return res.status(404).json({ error: "post not found" });

    const comment = await Comment.create({
      text,
      post: postId,
      author: req.user._id
    });

    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
};

exports.deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ error: "invalid comment id" });

    const comment = await Comment.findByIdAndDelete(id);
    if (!comment) return res.status(404).json({ error: "comment not found" });

    res.json({ message: "deleted" });
  } catch (err) {
    next(err);
  }
};
