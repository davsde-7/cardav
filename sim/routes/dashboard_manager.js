const express = require('express');
const simulator = require('./simulator');
const checkAuth = require('./checkAuth');
const Managers = require('../schemas/managerschema')
const Markets = require('../schemas/marketschema')
const router = express.Router();

/* GET manager dashboard page. */
router.get('/', checkAuth, function(req, res, next) {
  // If checkAuth was successfull, check if the user is a manager, otherwise redirect to prosumer dashboard.
  if (req.userData.role != "manager") {
    req.flash('error', 'Unauthorized access to manager dashboard');
    res.redirect('/dashboard_prosumer/');
  }
  res.render('dashboard_manager', {
    error:req.flash('error'), success:req.flash('success'), userData:req.userData
  });
});

/* API request to get all data from simulator */
router.get('/getAll', simulator.getAll);

/* API database request to get manager data from the database */
router.get('/getManagerData', async function(req, res) {
  await Managers.find(function(error, managers) {
    if(error) {
        console.log(error);
        return;
    }
    res.send(managers[0]);
  }.bind(this)).exec();
});

/* API database request to get market data from the database */
router.get('/getMarketData', async function (req, res) {
  await Markets.find(function(error, markets) {
    if(error) {
        console.log(error);
        return;
    }
    res.send(markets[0]);
  }.bind(this)).exec();
});

/* API Post to save the set electricity price to the database and for prosumers */
router.post('/saveElectricityPrice', async function(req,res) {
  await Managers.findOne(function(error, managers) {
    if(error) {
      console.log(error);
      return;
    }    
    managers.electricityPrice = req.body.price;
    managers.save();
  });
});

/* API Post to save the market buffer ratio for the manager */
router.post('/saveMarketBufferRatio', async function(req,res) {
  await Managers.findOne(function(error, managers) {
    if(error) {
      console.log(error);
      return;
    }    
    console.log(req.body)
    managers.marketRatio = req.body.marketRatio;
    console.log(managers)
    managers.bufferRatio = req.body.bufferRatio;
    console.log(managers)
    managers.save();
  });
});

/* API Post change the status of the powerplant, "Running", "Starting" and "Stopped" */
router.post('/savePowerPlantStatus', async function(req,res) {
  await Managers.findOne(function(error, managers) {
    if(error) {
      console.log(error);
      return;
    }    
    managers.powerPlantStatus = req.body.powerPlantStatus;
    managers.powerPlantStatusChangedDate = req.body.powerPlantStatusChangedDate;
    managers.save();
  });
});

module.exports = router;
