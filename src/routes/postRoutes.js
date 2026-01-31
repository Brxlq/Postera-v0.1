const router = require("express").Router();

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost
} = require("../controllers/postController");

// Public
router.get("/", getAllPosts);
router.get("/:id", getPostById);

// Admin-only write
router.post("/", auth, admin, createPost);
router.put("/:id", auth, admin, updatePost);
router.delete("/:id", auth, admin, deletePost);

module.exports = router;
