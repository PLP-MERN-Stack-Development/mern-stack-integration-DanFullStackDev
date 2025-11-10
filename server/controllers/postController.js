const Post = require('../models/Post');
const Category = require('../models/Category'); // We might need this later
const User = require('../models/User'); // We'll need this for createPost

/**
 * @desc    Get all posts
 * @route   GET /api/posts
 * @access  Public
 */
const getPosts = async (req, res, next) => {
  try {
    // We .populate('category', 'name') to fetch the related category's name
    // We .populate('author', 'username') to fetch the related author's username
    const posts = await Post.find()
      .populate('category', 'name')
      .populate('author', 'username')
      .sort({ createdAt: -1 }); // Show newest posts first

    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

/**
 * @desc    Get a single post by ID (or slug)
 * @route   GET /api/posts/:id
 * @access  Public
 */
const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('category', 'name')
      .populate('author', 'username');

    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

/**
 * @desc    Create a new post
 * @route   POST /api/posts
 * @access  Private (Needs Authentication)
 */
const createPost = async (req, res, next) => {
  try {
    // ----
    // NOTE: This is a placeholder for authentication
    // Later, req.user.id will come from your auth middleware
    // For now, we'll find the first user in the DB and use them as the author
    const tempUser = await User.findOne();
    if (!tempUser) {
      return res.status(400).json({ success: false, error: 'No users in database to assign as author' });
    }
    // ----

    // Add the temporary author to the request body
    req.body.author = tempUser._id;

    const post = await Post.create(req.body);

    res.status(201).json({
      success: true,
      data: post,
    });
  } catch (err) {
    // Handle validation errors
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((val) => val.message);
      return res.status(400).json({ success: false, error: messages });
    } else if (err.code === 11000) { // Duplicate key (slug)
      return res.status(400).json({ success: false, error: 'Post title/slug must be unique' });
    }
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

/**
 * @desc    Update an existing post
 * @route   PUT /api/posts/:id
 * @access  Private
 */
const updatePost = async (req, res, next) => {
  try {
    let post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }

    // (Later, we'll add a check here to make sure req.user is the author)

    post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Run Mongoose validation on update
    });

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

/**
 * @desc    Delete a post
 * @route   DELETE /api/posts/:id
 * @access  Private
 */
const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }

    // (Later, we'll add a check here to make sure req.user is the author)

    await post.deleteOne(); // or post.remove()

    res.status(200).json({
      success: true,
      data: {}, // Send back an empty object
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// Don't forget to export!
module.exports = {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};
