const express = require('express')
const router = express.Router()

/* GET login page. */
router.get('/', function(req, res) {
  res.clearCookie('token');
  req.flash('success', 'Successfully logged out');
  res.redirect('/login');
});

module.exports = router;
