
const express = require('express');

const bcrypt = require('bcrypt');
const passport = require('passport');

const User =  require('../models/user-model');
const router = express.Router();

// Login Page
router.get('/login', (req, res) => res.render('login', {title: 'Login',user: req.user}));

// Register Page
router.get('/register', (req, res) => res.render('register', {title: 'Register',user: req.user}));

// Register
router.post('/register', (req, res) => {
  const { firstName, lastName,username, email, password, password2 } = req.body;
  
  let errors = [];

  if (!firstName || !lastName || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      firstName,
      lastName,
      username,
      email,
      password,
      password2
    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('register', {
          errors,
          firstName,
          lastName,
          username,
          email,
          password,
          password2
        });
      } else {
        // NEW USER OBJECT
        const newUser = new User({
          firstName,
          lastName,
          username,
          email,
          password
        });
        //GENERATING HASH FOR PASSWORD
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                res.redirect('/users/login' );
              })
              
              .catch(err => console.log(err));
          })
         
        })
       
      }
    });
  }
});

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect( '/users/login');
});

module.exports = router;
