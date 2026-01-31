const mongoose = require("mongoose");
const Post = require("../models/Post");

exports.getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find()
      .populate("author", "email role")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    next(err);
  }
};

exports.getPostById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ error: "invalid post id" });

    const post = await Post.findById(id).populate("author", "email role");
    if (!post) return res.status(404).json({ error: "post not found" });

    res.json(post);
  } catch (err) {
    next(err);
  }
};

exports.createPost = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) return res.status(400).json({ error: "title and content are required" });

    const post = await Post.create({
      title,
      content,
      author: req.user._id
    });

    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ error: "invalid post id" });

    const { title, content } = req.body;
    const updates = {};
    if (title) updates.title = title;
    if (content) updates.content = content;

    const post = await Post.findByIdAndUpdate(id, updates, { new: true });
    if (!post) return res.status(404).json({ error: "post not found" });

    res.json(post);
  } catch (err) {
    next(err);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ error: "invalid post id" });

    const post = await Post.findByIdAndDelete(id);
    if (!post) return res.status(404).json({ error: "post not found" });

    res.json({ message: "deleted" });
  } catch (err) {
    next(err);
  }
};
