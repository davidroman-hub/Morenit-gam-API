const express = require('express')
const router = express.Router()

const {adminMiddlewares, requireSignin} = require('../controllers/auth');
const { create, list, listAllBlogsCategoriesTags,read, remove, update, photo } = require('../controllers/blog');

router.post('/blog',requireSignin, adminMiddlewares, create )
router.get('/blogs', list)
router.post('/blogs-categories-tags', listAllBlogsCategoriesTags)
router.get('/blog/:slug', read)
router.delete('/blog/:slug',requireSignin,adminMiddlewares ,remove)
router.put('/blog/:slug', requireSignin,adminMiddlewares,update)
router.get('/blog/photo/:slug', photo)

module.exports = router