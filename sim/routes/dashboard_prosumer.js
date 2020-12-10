var express = require('express');
var simulator = require('./simulator');
var router = express.Router();

/* GET dashboard page. */
router.get('/', function(req, res, next) {
  res.render('dashboard_prosumer', {error: req.flash('errors')});
});

// Test

router.get('/getWindSpeed', simulator.getWindSpeed);

router.get('/getAll', simulator.getAll);

module.exports = router;
