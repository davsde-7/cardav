const express = require('express');
const simulator = require('./simulator');
const checkAuth = require('./checkAuth');
const router = express.Router();

/* GET prosumers page. */
router.get('/', checkAuth, function(req, res, next) {
  // Check if logged in user is manager, otherwise redirect user to prosumer dashboard with error message
  if (req.userData.role != "manager") {
    req.flash('error', 'Unauthorized access to prosumers');
    res.redirect('/dashboard_prosumer/');
  }
  res.render('prosumers', {
    error:req.flash('error'), success:req.flash('success'), userData:req.userData
  });
});

/* API Get request to fetch all prosumer data */
router.get('/getProsumers', simulator.getProsumers);

/* API Get request to fetch simulator date */
router.get('/getDate', simulator.getDate);

module.exports = router;
