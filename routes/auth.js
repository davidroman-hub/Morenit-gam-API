const express = require('express')
const router = express.Router()

// import controller

const {signup, signin, signout} = require('../controllers/auth')

// import validators

const {userSignupValidator,userSigninValidator} = require('../validators/auth')
const {runValidation} = require('../validators/index')

// Routes
router.post('/signup', userSignupValidator, runValidation, signup)
router.post('/signin', userSigninValidator, runValidation, signin)
router.get('/signout', signout )

module.exports = router // {}