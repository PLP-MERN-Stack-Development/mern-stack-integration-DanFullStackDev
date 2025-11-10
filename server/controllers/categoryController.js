const Category = require('../models/Category');

/**
 * @desc    Get all categories
 * @route   GET /api/categories
 * @access  Public
 */
const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

/**
 * @desc    Create a new category
 * @route   POST /api/categories
 * @access  Private (we'll make this private/admin later)
 */
const createCategory = async (req, res, next) => {
  try {
    // req.body will contain the 'name' from the form
    const category = await Category.create(req.body);

    res.status(201).json({
      success: true,
      data: category,
    });
  } catch (err) {
    // Handle validation errors (e.g., duplicate name)
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((val) => val.message);
      return res.status(400).json({ success: false, error: messages });
    } else if (err.code === 11000) { // Duplicate key error
      return res.status(400).json({ success: false, error: 'Category name must be unique' });
    }
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

module.exports = {
  getCategories,
  createCategory,
};