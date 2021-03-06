const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

//user model
const User = require('../models/User');

// Login Page
router.get('/login', (req, res) => res.render('login'))

// Register Page
router.get('/register', (req, res) => res.render('register'))

// Register Handle
router.post('/register', (req, res)=> {
    const {name, email, password, password2} = req.body;

    let errors = [];

//    check required fields
    if(!name || !email || !password || !password2){
        errors.push({msg: 'Please fill in all fields'})
    }

//    check passwords match
    if(password !== password2){
        errors.push({msg: "passwords do not match"})
    }

//    password length
    if(password.length < 6) {
        errors.push({msg: 'password must be at least 6 characters'})
    }

    if(errors.length > 0){
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
    }else{
    //    validation passed
        User.findOne({ email: email })
            .then(user => {
                if (user) {
                    // User Exists
                    errors.push({ msg: 'email is already registered'})
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password,

                    });
                } else {
                    const newUser = new User({
                        name,
                        email,
                        password
                    });

                //    hash password
                    bcrypt.genSalt(10, (err, salt) =>
                        bcrypt.hash(newUser.password, salt, (err, hash) =>{
                            if(err) throw err;
                            // set password to hashed
                            newUser.password = hash;
                        //    Save User
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', 'You are now registered and can now log in');
                                    res.redirect('/users/login')
                                })
                                .catch(err => console.log(err));

                        }))
                }
            });
    }
});

// Login Handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);

});

//logout handle
router.get('/logout',(req, res)=>{
    req.logout();
    req.flash('success_msg','You are logged out');
    res.redirect('/users/login');
})



module.exports = router;