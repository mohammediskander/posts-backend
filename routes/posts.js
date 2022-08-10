const express = require("express");
const router = express.Router();

const {
  getPosts,
  createPost,
  getSinglePost,
  updatePost,
  deletePost,
  likePost,
  disLikePost,
} = require("../controllers/post");

// Get all posts
// Create post
router.route("/").get(getPosts).post(createPost);

// Get single post
// Upadte post
// Delete post
router.route("/:id").get(getSinglePost).put(updatePost).delete(deletePost);

// Likeing the post +
router.route("/:id/like").put(likePost);
// Dislikeing the post -
router.route("/:id/dislike").put(disLikePost);

module.exports = router;
