// Post.js - Mongoose model for blog posts with inline explanations

const mongoose = require('mongoose');

// Define the schema for a blog post
const PostSchema = new mongoose.Schema(
  {
    // Title of the post (required, trimmed, max length)
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },

    // Main content/body of the post (required)
    content: {
      type: String,
      required: [true, 'Please provide content'],
    },

    // Filename or URL for a featured image - default provided
    featuredImage: {
      type: String,
      default: 'default-post.jpg',
    },

    // URL-friendly identifier generated from the title (slug)
    // unique: true enforces uniqueness at the DB/index level
    slug: {
      type: String,
   
      unique: true,
    },

    // Short summary or teaser for the post
    excerpt: {
      type: String,
      maxlength: [200, 'Excerpt cannot be more than 200 characters'],
    },

    // Reference to the author (relational link to User collection)
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Category reference (relational link to Category collection)
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },

    // Array of tag strings for simple tagging
    tags: [String],

    // Whether the post is published or still a draft
    isPublished: {
      type: Boolean,
      default: false,
    },

    // Simple counter for tracking views
    viewCount: {
      type: Number,
      default: 0,
    },

    // Embedded subdocuments for comments
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User', // link back to User who commented
        },
        content: {
          type: String,
          required: true, // comment text must be present
        },
        createdAt: {
          type: Date,
          default: Date.now, // timestamp when comment was created
        },
      },
    ],
  },
  {
    // Automatically add `createdAt` and `updatedAt` fields
    timestamps: true,
  }
);

// PRE-SAVE HOOK
// Create a slug from the title before saving the document.
// This runs on save() and create(); it only regenerates when title was modified.
// Replace it with this code:
PostSchema.pre('save', function (next) {
  // Always generate a slug from the title if the title exists
  if (this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
  }
  next();
});

// VIRTUAL PROPERTY
// `post.url` will return a convenience URL path for the post.
// Virtuals are not stored in the DB.
PostSchema.virtual('url').get(function () {
  return `/posts/${this.slug}`;
});

// INSTANCE METHOD: addComment
// Adds a comment subdocument and saves the post.
// Returns a Promise (the result of this.save()).
PostSchema.methods.addComment = function (userId, content) {
  // Push a new comment into the comments array
  this.comments.push({ user: userId, content });
  // Persist changes
  return this.save();
};

// INSTANCE METHOD: incrementViewCount
// Increments viewCount and persists the change.
// Useful to keep view logic on the model side.
PostSchema.methods.incrementViewCount = function () {
  this.viewCount += 1;
  return this.save();
};

// Export the model so it can be used elsewhere in the app
module.exports = mongoose.model('Post', PostSchema);