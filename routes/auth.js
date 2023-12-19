const bcrypt = require('bcrypt');
const saltRounds = 10;
const express = require('express');
const router = express.Router();


const User = require("../models/user.model");
const {isLoggedIn, isLoggedOut} = require('../middlewares/route-guard');
router.get("/signup",isLoggedOut, (req,res,next)=>{
    console.log("req.session Signup", req.session)
    res.render("signup")
});
//post signup//
router.post("/signup", isLoggedOut,(req, res, next) =>{
   
    const {username, password, email } = req.body;


              bcrypt.hash(password, saltRounds) // encrypt the password
                .then((hash) => {
                    console.log('hash', hash)
                    return User.create({ username, password: hash, email})
                 
                })
                .then(user => {
                    console.log("user", user);
                    // res.redirect(`/profile`);
                    req.session.currentUser = user;
                    res.render('profile', user)
                })
            .catch(err => console.log(err))  
});
// router.get("/profile",(req, res, next)=>{
//     res.render("views/profile");
// });
router.get("/login", isLoggedOut, (req, res)=>{
    console.log("req.session", req.session)
    res.render("login")
})

router.post("/login", isLoggedOut, (req, res)=>{

    const { email, password } = req.body;
 
  if (email === '' || password === '') {
    res.render('login', {
      errorMessage: 'Please enter email and password to login.'
    });
    return;
  }

  User.findOne({ email }) // --> {email: ..., password:....} || null
    .then(user => {
        console.log('user', user)
        if (!user) {
        console.log("Email not registered. ");
        res.render('login', { errorMessage: 'Incorrect email or password.' });
        return;
        }
        else if (bcrypt.compare(password, user.password)) {
            req.session.currentUser = user;
            res.render('profile', user);
            // res.redirect(`/profile/${user.username}`)
        } else {
            console.log("Incorrect password. ");
            res.render('login', { errorMessage: 'Incorrect email or password.' });
          }
    })
    .catch(err => console.log(err))
})

router.post('/logout', isLoggedIn, (req, res, next) => {
    req.session.destroy(err => {
      if (err) next(err);
      res.redirect('/');
    });
  });
//profile page
router.get("/profile", isLoggedIn, (req, res, next) => {
    console.log("req.session", req.session)
    res.render("profile");
});

module.exports = router;