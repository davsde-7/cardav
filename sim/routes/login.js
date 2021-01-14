const express = require('express');
const bcryptjs = require('bcryptjs');
const router = express.Router();
const jwt = require('jsonwebtoken');

const User = require('../schemas/userschema');
const Prosumer = require('../schemas/prosumerschema');

/* GET login page. */
router.get('/', function(req, res) {
  // If there are any errors when filling out the forms etc., or if you're sent here from a bad authorization, display them 
  if(req.flash('error') != "") {
    var error = req.flash('error');
  }
  else {
    var error = req.session.error;
    delete req.session.error;
  }
  res.render('login', {error:error, success:req.flash('success')});
});

/* Login validation */
router.post('/', async function(req, res) {
  // Fetches input from login form
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
      // Username exists in database
      let user = await User.findOne({username: req.body.username});
      // Check if userpassword and entered password are the same
      var isMatch = await bcryptjs.compare(password, user.password);

      if (isMatch) {
        // The passwords are the same, sign a cookie/token for the user to authorize themselves with
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
        // Tell the database you logged in to keep track of online users
        user.lastloggedin = Date.now();
        user.loggedin = true;

        // If you logged in as a prosumer also save it in the prosumer database
        if(user.role == "prosumer") {
          let prosumer = await Prosumer.findOne({username: user.username});
          prosumer.lastloggedin = Date.now();
          prosumer.loggedin = true;
          prosumer.save();
        }
        await user.save();
        
        // If user logging in is a manager, redirect to the manager dashboard
        if(user.role == "manager") {
          res.cookie('token', token, { httpOnly: true });
          res.redirect('/dashboard_manager/');
        } 
        
        // Else redirect user to the prosumer dashboard
        else {
          res.cookie('token', token, { httpOnly: true });
          res.redirect('/dashboard_prosumer/');
        }
      } 
      
      // If password does not match, show error
      else {
        errors=[{msg: 'Username or password is incorrect'}]
        res.render('login', {
          errors:errors
        });
      }
    } 

    // If username not found, show error
    // Same errors for invalid password or username, makes it harder to brutforce accounts. 
    // Especially considering there's no timeout after x amount of failed logins
    else {
      errors=[{msg: 'Username or password is incorrect'}]
      res.render('login', {
        errors:errors
      });
    }
  }
});

module.exports = router;
