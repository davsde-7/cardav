const express = require('express');
const router = express.Router();
const Users = require('../schemas/userschema');
const checkAuth = require('./checkAuth');

/* GET users listing. */
router.get('/', checkAuth, function(req, res) {
  res.redirect('/users/'+req.userData.username);
});

/* GET single user */
router.get('/:username', checkAuth, function(req, res) {
  Users.findOne({username:req.params.username}, function(err, user){
    if(err) {
      console.log(err)
      res.redirect('/users')
    }
    if(user) {
      res.render('users', {
        user:user,
        userData:req.userData
      });
    }
    else{
      console.log("Found no user")
      req.flash('error', 'Could not find a user with that username');
      res.redirect('/');
    }
  });

});

module.exports = router;
