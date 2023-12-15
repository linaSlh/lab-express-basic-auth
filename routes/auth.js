const bcrypt = require('bcypt');
const saltRounds = 10;
const express = require('express');
const router = express.Router();

const User = require("../models/user.model");

// get the signuip page
router.get("/signup", (req,res,next)=>{
    res.render("views/signup")
});
//post signup//
router.post("/signup", (req, res, next) =>{
    const {username, password} = req.body;


              bcrypt.hash(password, saltRounds) // encrypt the password
                .then((hash) => {
                    console.log('hash', hash)
                    return User.create({ username, password: hash})
                })
                .then(user => {
                    res.redirect(`/profile`)
                })
            .catch(err => console.log(err))  
});
router.get("/profile",(req, res, next)=>{
    res.render("views/profile");
});

module.exports = router;