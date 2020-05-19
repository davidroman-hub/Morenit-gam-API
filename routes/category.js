const express = require('express')
const router = express.Router()

const {adminMiddlewares, requireSignin} = require('../controllers/auth')
const {create, read, update,remove, list, categoryById} = require('../controllers/category')
const {categoryCreateValidator} = require('../validators/category')
const {runValidation} = require('../validators/index')

//router.post('/category/create/:Id',requireSignin,adminMiddleware,create)
router.post('/category', categoryCreateValidator, runValidation , requireSignin, adminMiddlewares, create)
router.get('/category/:categoryId', read)
router.put('/category/:categoryId/:Id',requireSignin,adminMiddlewares,update)
router.delete('/category/:categoryId/:Id', requireSignin,adminMiddlewares,remove)
router.get('/categories',list)


 router.param("categoryId",categoryById)
 module.exports = router