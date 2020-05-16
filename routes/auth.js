const express = require('express')
const router = express.Router()

// import controller

const {signup} = require('../controllers/auth')

// import validators

const {userSignupValidator,userSigninValidator} = require('../validators/auth')
const {runValidation} = require('../validators/index')


router.post('/signup', userSignupValidator, runValidation, signup)



module.exports = router // {}