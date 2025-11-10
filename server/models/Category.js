const mongoose = require('mongoose');
const { Schema } = mongoose;

// 1. Create the Schema
const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true,
      minlength: [2, 'Category name must be at least 2 characters long'],
      maxlength: [30, 'Category name cannot exceed 30 characters'],
    },
  },
  {
    // 2. Add Options
    timestamps: true,
  }
);

// 3. Create and Export the Model
const Category = mongoose.model('Category', categorySchema);
module.exports = Category;