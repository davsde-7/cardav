const express = require('express');
const simulator = require('./simulator');
const checkAuth = require('./checkAuth');
const Managers = require('../schemas/managerschema')
const Markets = require('../schemas/marketschema')
const router = express.Router();

/* GET dashboard page. */
router.get('/', checkAuth, function(req, res, next) {
  if (req.userData.role != "manager") {
    req.flash('errors', 'You do not have the authorization to visit the dashboard for managers');
    res.redirect('/dashboard_prosumer/');
  }
  res.render('dashboard_manager');
});

router.get('/getWindSpeed', simulator.getWindSpeed);

router.get('/getDate', simulator.getDate);

router.get('/getAll', simulator.getAll);

router.get('/getManagerData', async function(req, res) {
  await Managers.find(function(error, managers) {
    if(error) {
        console.log(error);
        return;
    }
    res.send(managers[0]);
  }.bind(this)).exec();
});

router.get('/getMarketData', async function (req, res) {
  await Markets.find(function(error, markets) {
    if(error) {
        console.log(error);
        return;
    }
    res.send(markets[0]);
  }.bind(this)).exec();
});

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
