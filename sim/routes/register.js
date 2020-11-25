const express = require('express')
const bcryptjs = require('bcryptjs')
const router = express.Router()

let User = require('../schemas/userschema')

/* GET register page. */
router.get('/', function(req, res) {
  res.render('register');
});


// Register form
router.post('/', async function(req, res) {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const password2 = req.body.password2;

  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  let errors = req.validationErrors();
  if (errors) {
    res.render('register', {
      errors:errors
    });
  } else {
    // Error handling
    // Check if email already registered
    let useremail = await User.findOne({email: req.body.email})
    if(useremail) {
      errors=[{msg: 'Email is already registered'}]
      res.render('register', {
        errors:errors
      });
    }
    else {
    // Check if username already registered
    let userusername = await User.findOne({username: req.body.username})
    if(userusername) {
      errors=[{msg: 'Username is already registered'}]
      res.render('register', {
        errors:errors
      });
    }
    else {
      // Fills the schematic with values from the form
      let newUser = new User({
        username:username,
        email:email,
        password:password,
      })

      // Hashes password and creates the user and saves it to the database
      bcryptjs.genSalt(10, function(error, salt) {
        bcryptjs.hash(newUser.password, salt, function(error, hash) {
          if(error){
            console.log(error);
          }
          newUser.password = hash;
          newUser.save(function(error){
            if (error) {
              console.log(error);
              return;
            } else {
              res.redirect('/login');
            }
          })
        })
      })
    }
    }
  }
})

module.exports = router;
