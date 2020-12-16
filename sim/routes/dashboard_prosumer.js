var express = require('express');
var simulator = require('./simulator');
const Prosumers = require('../schemas/prosumerschema')
const checkAuth = require('./checkAuth');
var router = express.Router();

/* GET dashboard page. */
router.get('/', checkAuth, function(req, res, next) {
  res.render('dashboard_prosumer', {
    error:req.flash('error'), success:req.flash('success'), userData:req.userData
  });
});
// Test

router.get('/getProsumer', checkAuth, async function(req, res) {
  await Prosumers.find({username:req.userData.username}, function(error, prosumers) {
    if(error) {
        console.log(error);
        return;
    }
    res.send(prosumers[0]);
  }.bind(this)).exec();
}) 

router.get('/getWindSpeed', checkAuth, simulator.getWindSpeed);

router.get('/getAll', checkAuth, simulator.getAll);

router.post('/saveNetProduction', checkAuth, async function(req,res) {
  await Prosumers.find({username:req.userData.username}, function(error, prosumers) {
    if(error) {
      console.log(error);
      return;
    }    
    prosumers[0].netProdToBufRatio = req.body.netProdToBufRatio;
    prosumers[0].save();
  });
});

router.post('/saveUnderProduction', checkAuth, async function(req,res) {
  await Prosumers.find({username:req.userData.username}, function(error, prosumers) {
    if(error) {
      console.log(error);
      return;
    }    
    prosumers[0].undProdFromBufRatio = req.body.undProdFromBufRatio;
    prosumers[0].save();
  });
});

module.exports = router;
 