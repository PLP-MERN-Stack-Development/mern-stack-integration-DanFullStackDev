const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      // Simple email validation regex
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please fill a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // This ensures the password is NOT returned in query results
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  {
    timestamps: true,
  }
);

// Mongoose Middleware: Hash password BEFORE saving to database
userSchema.pre('save', async function (next) {
  // 'this' refers to the user document
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }

  // 1. Generate a "salt" (random string) to add to the hash
  const salt = await bcrypt.genSalt(10);
  // 2. Hash the password using the salt
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Mongoose Method: Create a custom function for the User model
// This will compare the password from a login attempt with the hashed password in the DB
userSchema.methods.matchPassword = async function (enteredPassword) {
  // 'this.password' is the hashed password from the DB
  return await bcrypt.compare(enteredPassword, this.password);
};

// Create and export the model
const User = mongoose.model('User', userSchema);
module.exports = User;