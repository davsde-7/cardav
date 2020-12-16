const express = require('express');
const simulator = require('./simulator');
const checkAuth = require('./checkAuth');
const router = express.Router();

/* GET dashboard page. */
router.get('/', checkAuth, function(req, res, next) {
  if (req.userData.role != "manager") {
    req.flash('error', 'Unauthorized access to prosumers');
    res.redirect('/dashboard_prosumer/');
  }
  res.render('prosumers', {
    error:req.flash('error'), success:req.flash('success'), userData:req.userData
  });
});

router.get('/getProsumers', simulator.getProsumers);

router.get('/getDate', simulator.getDate);

module.exports = router;
