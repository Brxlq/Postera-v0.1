const router = require("express").Router();

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const {
  getCommentsForPost,
  createCommentForPost,
  deleteComment
} = require("../controllers/commentController");

// Public: read comments for a post
router.get("/posts/:postId/comments", getCommentsForPost);

// Auth: create comment
router.post("/posts/:postId/comments", auth, createCommentForPost);

// Admin: delete comment
router.delete("/comments/:id", auth, admin, deleteComment);

module.exports = router;
