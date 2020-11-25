const express = require('express')
const bcryptjs = require('bcryptjs')
const router = express.Router()

let User = require('../schemas/userschema')

/* GET login page. */
router.get('/', function(req, res) {
  res.render('login');
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
  } else {
    // Check if username exists in database
    let userusername = await User.findOne({username: req.body.username})
    if(userusername) {
      let user = await User.findOne({username: req.body.username});
      const isMatch = await bcryptjs.compare(password, user.password);

      if (isMatch) {
        res.redirect('/dashboard_manager');
      } else {
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
