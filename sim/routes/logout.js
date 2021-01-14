const express = require('express');
const checkAuth = require('./checkAuth');
const User = require('../schemas/userschema');
const Prosumer = require('../schemas/prosumerschema');
const router = express.Router();


/* Executes the logout function and redirects to login page. */
router.get('/', checkAuth, async function(req, res) {
  let user = await User.findOne({username: req.userData.username});
  user.loggedin = false;
  await user.save();
  if (user.role != "manager") {
    let prosumer = await Prosumer.findOne({username: req.userData.username});
    prosumer.loggedin = false;
    await prosumer.save();
  }
  res.clearCookie('token');
  req.flash('success', 'Logged out');
  res.redirect('/login');
});

module.exports = router;
