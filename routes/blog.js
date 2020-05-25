const express = require('express')
const router = express.Router()

const {adminMiddlewares, requireSignin} = require('../controllers/auth');
const { create, list, listAllBlogsCategoriesTags,read, remove, update } = require('../controllers/blog');

router.post('/blog',requireSignin, adminMiddlewares, create )
router.get('/blogs', list)
router.post('/blogs-categories-tags/', listAllBlogsCategoriesTags)
router.get('/blog/:slug', read)
router.delete('/blog/:slug',requireSignin,adminMiddlewares ,remove)
router.put('/blog/:slug', requireSignin,adminMiddlewares,update)

module.exports = router