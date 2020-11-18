const express = require('express')
const bcryptjs = require('bcryptjs')
const router = express.Router()

let User = require('../schemas/userschema')
/* GET register page. */
router.get('/', function(req, res) {
  res.render('register');
});


// Register form
router.post('/', function(req, res, next) {
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;

  let newUser = new User({
    username:username,
    email:email,
    password:password,
  })
  bcryptjs.genSalt(10, function(error, salt) {
    bcryptjs.hash(newUser.password, salt, function(error, hash) {
      if(error){
        console.log(error)
      }
      newUser.password = hash
      newUser.save(function(error){
        if (error) {
          console.log(error)
          return
        } else {
          console.log('success')
          res.redirect('/login')
        }
      })
    })
  })
})

router.get('/', function(req, res) {
  res.render('login');
});

module.exports = router;
