var express = require('express');
var simulator = require('./simulator');
var router = express.Router();

/* GET dashboard page. */
router.get('/', function(req, res, next) {
  res.render('prosumers');
});

router.get('/getProsumers', simulator.getProsumers);

router.get('/getDate', simulator.getDate);

module.exports = router;
