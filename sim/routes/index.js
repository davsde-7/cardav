const express = require('express');
const router = express.Router();
const homeAuth = require('./homeAuth');

/* GET home page. */
router.get('/', homeAuth, function(req, res) {
  res.render('index', {
    error:req.flash('error'), success:req.flash('success'), userData:req.userData
  });
});

module.exports = router;
