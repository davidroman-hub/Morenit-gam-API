const express = require('express')
const router = express.Router()

const {adminMiddlewares, requireSignin} = require('../controllers/auth');
const { create } = require('../controllers/blog');

router.post('/blog',requireSignin, adminMiddlewares, create )

module.exports = router