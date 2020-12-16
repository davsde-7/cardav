const express = require('express');
const router = express.Router();
const Users = require('../schemas/userschema');
const checkAuth = require('./checkAuth');
const multer = require('multer');
const fs = require('fs');

const upload = multer({dest: 'public/images'});

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
        user:user, userData:req.userData, error:req.flash('error'), success:req.flash('success'),
      });
    }
    else{
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

module.exports = router;
