const express = require('express');
const router = express.Router();

// A simple test route
// GET /api/auth/test
router.get('/test', (req, res) => {
  res.send('Auth routes are working!');
});

module.exports = router;