const express = require('express')
const router = express.Router()

const {adminMiddleware, requireSignin} = require('../controllers/auth')
const {create, read, update,remove, list, categoryById} = require('../controllers/category')


router.post('/category/create/:Id',requireSignin,adminMiddleware,create)
router.get('/category/:categoryId', read)
router.put('/category/:categoryId/:Id',requireSignin,adminMiddleware,update)
router.delete('/category/:categoryId/:Id', requireSignin,adminMiddleware,remove)
router.get('/categories',list)


 router.param("categoryId",categoryById)
 module.exports = router