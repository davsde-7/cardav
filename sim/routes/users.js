const express = require('express');
const router = express.Router();
const Users = require('../schemas/userschema');
const checkAuth = require('./checkAuth');
const multer = require('multer');
const fs = require('fs');
const Prosumers = require('../schemas/prosumerschema');
const upload = multer({dest: 'public/images'});

/* GET users listing. */
router.get('/', checkAuth, function(req, res) {
  res.redirect('/users/'+req.userData.username);
});

/* GET single user */
router.get('/:username', checkAuth, function(req, res) {
  // Search database for user with url username
  Users.findOne({username:req.params.username}, function(err, user){
    if(err) {
      // Some kind of error happened
      console.log(err)
      res.redirect('/users')
    }
    if(user) {
      // User with :username found, render the profile page for that user
      res.render('users', {
        user:user, userData:req.userData, error:req.flash('error'), success:req.flash('success'),
      });
    }
    else{
      // Found no :username in database, redirect back to logged in users profile page
      console.log("Found no user")
      req.flash('error', 'Could not find a user with that username');
      res.redirect('/');
    }
  });
});

/* IMAGE upload */
router.post('/:username/upload', upload.single('image'), function(req, res, next) {
  var tmp_path = req.file.path;
  var target_path = 'public/images/' + req.params.username + ".png";
  var src = fs.createReadStream(tmp_path);
  var dest = fs.createWriteStream(target_path);
  src.pipe(dest);
  src.on('end', function() { 
    req.flash('success', 'Successfully uploaded image')
    console.log("Successfully uploaded image");
    res.redirect('/users/'+req.params.username);
  });
  src.on('error', function(err) { 
    req.flash('error', 'Error when uploading image, wrong image type?')
    console.log("Error when uploading image :" + err);
    res.redirect('/users');
  });
});

/* API Post to block the user x amount of seconds*/
router.post('/:username/saveBlock', checkAuth, async function(req,res) {
  // Make sure that a manager is doing it, otherwise it's unauthorized access.
  if (req.userData.role != "manager") {
    req.flash('error', 'Unauthorized access to block user');
    res.redirect('/dashboard_prosumer/');
  }
  await Prosumers.find({username:req.params.username}, function(error, prosumers) {
    if(error) {
      console.log(error);
      return;
    }
    prosumers[0].blocked = true;
    prosumers[0].save();
    setTimeout( function(){
      prosumers[0].blocked = false;
      prosumers[0].save();
    }, req.body.timeBlock*1000);
  });
});

/* GET user/profile edit page*/
router.post('/:username/edit', checkAuth, async function(req,res) {
  // Make sure that a manager is doing it, otherwise it's unauthorized access.
  if (req.userData.role != "manager") {
    req.flash('error', 'Unauthorized access to edit user');
    res.redirect('/');
  }
  else {
    Users.findOne({username:req.params.username}, function(err, user){
      if(err) {
        console.log(err)
        res.redirect('/users')
      }
      if(user) {
        res.render('users_edit', {
          user:user, userData:req.userData, error:req.flash('error'), success:req.flash('success'),
        });
      }
      else{
        console.log("Found no user")
        req.flash('error', 'Could not find a user with that username');
        res.redirect('/');
      }
    });
  }
});

/* API Post to update the user with new data*/
router.post('/:username/edit/update', checkAuth, async function(req,res) {
  if (req.userData.role != "manager") {
    req.flash('error', 'Unauthorized access to edit user');
    res.redirect('/');
  }
  Users.findOne({username:req.params.username}, function(err, user){
    if(err) {
      console.log(err)
      res.redirect('/users')
    }
    if(user) {
      user.username = req.body.username;
      user.email = req.body.email;
      Prosumers.findOne({username:req.params.username}, function(err, prosumer){
        if(err) {
          console.log(err)
          res.redirect('/users')
        }
        if(prosumer) {
          prosumer.username = req.body.username;
          prosumer.save();
        }
        else{
          req.flash('error', 'Could not find a prosumer with that username');
          res.redirect('/');
        }
      });
      user.save();
      // After updating the user there's a risk that the username has been changed
      // so you also need to change the profile page image so it matches the new username
      var target_path = 'public/images/' + req.params.username + ".png";
      var new_target_path = 'public/images/' + req.body.username + ".png";
      fs.rename(target_path, new_target_path, function (err) {
        if (err) {
          console.log(err)
        }
        console.log('File updated!');
      }); 
      req.flash('success', 'User updated');
      res.redirect('/users/'+user.username);
    }
    else{
      console.log("Found no user")
      req.flash('error', 'Could not find a user with that username');
      res.redirect('/');
    }
  });
});

/* API Post to delete the user*/
router.post('/:username/edit/delete', checkAuth, async function(req,res) {
  if (req.userData.role != "manager") {
    req.flash('error', 'Unauthorized access to delete user');
    res.redirect('/');
  }
  Users.deleteOne({username:req.params.username}, function(err){
    if(err) {
      console.log(err)
      res.redirect('/users')
    }
    else{
      Prosumers.deleteOne({username:req.params.username}, function(err){
        if(err) {
          console.log(err)
          res.redirect('/users')
        }
      });
      var target_path = 'public/images/' + req.params.username + ".png";
      fs.unlink(target_path, function (err) {
        if (err) {
          console.log(err)
        }
        console.log('File deleted!');
      }); 
      req.flash('success', 'User deleted');
      res.redirect('/users');
    }
  });
});




module.exports = router;
