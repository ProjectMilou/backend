'use strict';
const express = require('express');
const router = express.Router();

// register
router.post('/register', (req, res) => {

    // just for testing purposes
    console.log("incomming post request under /user/register");
    res.send("thanks for your registration")
});

router.get('/confirm/:id', (req, res) => {

});

// login
router.post('/login', (req, res) => {

});

// logout
router.get('/logout', (req, res) => {

});

// profile
router.get('/profile', (req, res) => {

});

// forgot password
router.post('/forgot', (req, res) => {

});

router.post('/reset/:id', (req, res) => {

});


// edit profile
router.post('/edit', (req, res) => {

});

// delete profile
router.delete('/profile', (req, res) => {

});

// search for a bank
router.get('/bank', (req,res) => {

})

// add a bank
router.post('/bank_connection', (req, res) => {

});

// delete a bank connection
router.delete('/bank_connection', (req, res) => {

});

module.exports = router
