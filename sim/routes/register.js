const express = require('express')
const bcryptjs = require('bcryptjs')
const router = express.Router()

const Prosumers = require('../schemas/prosumerschema')
const User = require('../schemas/userschema')

/* GET register page. */
router.get('/', function(req, res) {
  res.render('register');
});

/* Register form validation */
router.post('/', async function(req, res) {
  // Collect form data
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const password2 = req.body.password2;

  // Check requirements for the data in the forms
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  // If any errors found in form data, collect errors
  let errors = req.validationErrors();
  if (errors) {
    res.render('register', {
      errors:errors
    });
  } else {
    // No errors in form-data found, see if username/email already occupied
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
      // Fills the schematic with the data from the form
      let newUser = new User({
        username:username,
        email:email,
        password:password,
      })

      let newProsumer = new Prosumers({
        username:username,
      })

      // Hashes password and creates a user and prosumer and saves it to the database
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
              newProsumer.save(function(error){
                if (error) {
                  console.log(error);
                  return;
                } else {
                  console.log("Success, added the prosumer " + username + " to the database.");
                }              
              })
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
