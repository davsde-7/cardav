const express = require('express');
const bcryptjs = require('bcryptjs');
const router = express.Router();
const jwt = require('jsonwebtoken');

const User = require('../schemas/userschema');
const Prosumer = require('../schemas/prosumerschema');

/* GET login page. */
router.get('/', function(req, res) {
  if(req.flash('error') != "") {
    var error = req.flash('error');
  }
  else {
    var error = req.session.error;
    delete req.session.error;
  }
  res.render('login', {error:error, success:req.flash('success')});
});

//login validation
router.post('/', async function(req, res) {
  // Fetches input from form
  const username = req.body.username;
  const password = req.body.password;
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();

  // If username or password is empty, throw errors
  let errors = req.validationErrors();
  if (errors) {
    res.render('login', {
      errors:errors
    });

  // Else if valid input, continue
  } 
  
  else {
    // Check if username exists in database
    let userusername = await User.findOne({username: req.body.username})
    if(userusername) {
      let user = await User.findOne({username: req.body.username});
      var isMatch = await bcryptjs.compare(password, user.password);

      if (isMatch) {
        var token = jwt.sign(
          {
            username: user.username,
            role: user.role,
            userId: user._id
          }, 
          process.env.JWT_KEY,
          {
            expiresIn: "10m"
          }
        )
        user.lastloggedin = Date.now();
        user.loggedin = true;
        if(user.role == "prosumer") {
          let prosumer = await Prosumer.findOne({username: user.username});
          prosumer.lastloggedin = Date.now();
          prosumer.loggedin = true;
          prosumer.save();
        }
        await user.save();
        
        if(user.role == "manager") {
          res.cookie('token', token, { httpOnly: true });
          res.redirect('/dashboard_manager/');
        } else {
          res.cookie('token', token, { httpOnly: true });
          res.redirect('/dashboard_prosumer/');
        }
      } 
      
      else {
        errors=[{msg: 'Username or password is incorrect'}]
        res.render('login', {
          errors:errors
        });
      }
    } 

    // If username not found, show error
    else {
      errors=[{msg: 'Username or password is incorrect'}]
      res.render('login', {
        errors:errors
      });
    }
  }
});

module.exports = router;
