var express = require('express');
var simulator = require('./simulator');
const Prosumers = require('../schemas/prosumerschema')
const checkAuth = require('./checkAuth');
var router = express.Router();

/* GET prosumer dashboard page. */
router.get('/', checkAuth, function(req, res, next) {
  res.render('dashboard_prosumer', {
    error:req.flash('error'), success:req.flash('success'), userData:req.userData
  });
});

/* API request to get all data from simulator */
router.get('/getAll', checkAuth, simulator.getAll);

/* API database request to get manager data from the database */
router.get('/getProsumer', checkAuth, async function(req, res) {
  await Prosumers.find({username:req.userData.username}, function(error, prosumers) {
    if(error) {
        console.log(error);
        return;
    }
    res.send(prosumers[0]);
  }.bind(this)).exec();
}) 

/* API Post to save the net production ratio for the logged in prosumer */
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

/* API Post to save the under production ratio for the logged in prosumer */
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
 