const express = require('express');
const simulator = require('./simulator');
const checkAuth = require('./checkAuth');
const router = express.Router();

/* GET dashboard page. */
router.get('/', checkAuth, function(req, res, next) {
  // console.log(req.userdata)
  // if(req.userdata.role == "manager") {
  //   res.render('dashboard_manager');
  // }
  // else {
  //   res.redirect('/login')
  // }
  res.render('dasboard_manager');
});

router.get('/getWindSpeed', simulator.getWindSpeed);

router.get('/getDate', simulator.getDate);

router.get('/getAll', simulator.getAll);

module.exports = router;
