// server/routes/uploadRoutes.js
const express = require('express');
const { upload } = require('../utils/fileUploader'); // Use require

const router = express.Router();

router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No file uploaded.' });
  }

  // Replace backslashes (for Windows) with forward slashes
  const imagePath = req.file.path.replace(/\\/g, '/');

  res.status(201).json({
    success: true,
    data: {
      // Remove 'server/' from the path
      imagePath: `/${imagePath.replace('server/', '')}`, 
    },
  });
});

module.exports = router; // Use module.exports