const express = require('express')
const router = express.Router()

/* GET login page. */
router.get('/', function(req, res) {
  res.clearCookie('token')
  res.redirect('/login');
});

module.exports = router;
