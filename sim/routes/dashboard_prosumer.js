var express = require('express');
var router = express.Router();

/* GET dashboard page. */
router.get('/', function(req, res, next) {
  res.render('dashboard_prosumer');
});

router.get('/getWindSpeed', function(req, res, next) {
  
})

module.exports = router;
