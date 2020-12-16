const express = require('express');
const router = express.Router();
const checkAuth = require('./checkAuth')

/* GET dashboard page. */
router.get('/', checkAuth, function(req, res) {
  res.render('manager', {
    error:req.flash('error'), success:req.flash('success'), userData:req.userData
  });
});

module.exports = router;
