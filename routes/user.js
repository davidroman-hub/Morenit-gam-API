const express = require('express')
const router = express.Router()

// import controller

const { authMiddlewares, adminMiddlewares, requireSignin} = require('../controllers/auth')
const {read} =require('../controllers/user')

// Routes
router.get('/profile',requireSignin , authMiddlewares ,read)


module.exports = router // {}