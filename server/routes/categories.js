const express = require('express');
const router = express.Router();

// 1. Import the controller functions
const {
  getCategories,
  createCategory,
} = require('../controllers/categoryController');

// 2. Define the routes
// This tells Express to use getCategories for a GET request to /
// and createCategory for a POST request to /
router.route('/')
  .get(getCategories)
  .post(createCategory);

module.exports = router;