const express = require('express')
const router = express.Router()

const {adminMiddlewares, requireSignin} = require('../controllers/auth')
const {create, read, update,remove, list, categoryById} = require('../controllers/tags')
const {tagCreateValidator} = require('../validators/tags')
const {runValidation} = require('../validators/index')


router.post('/tag', tagCreateValidator, runValidation , requireSignin, adminMiddlewares, create);
router.get('/tag/:slug', read);
//router.put('/category/:categoryId/:Id',requireSignin,adminMiddlewares,update)
router.delete('/tag/:slug', requireSignin,adminMiddlewares,remove)
router.get('/tags',list)


// router.param("categoryId",categoryById)
 module.exports = router