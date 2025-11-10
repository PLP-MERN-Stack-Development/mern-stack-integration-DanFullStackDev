const express = require('express');
const router = express.Router();

// 1. Import the controller functions
const {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} = require('../controllers/postController');

// 2. Define the routes

// /api/posts
router.route('/')
  .get(getPosts)     // GET /api/posts
  .post(createPost);  // POST /api/posts

// /api/posts/:id
router.route('/:id')
  .get(getPostById)   // GET /api/posts/some-id
  .put(updatePost)    // PUT /api/posts/some-id
  .delete(deletePost); // DELETE /api/posts/some-id

module.exports = router;