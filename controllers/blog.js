const Blog = require('../models/blog')
const formidable = require('formidable')
const slugify = require('slugify')
const stripHtml = require('string-strip-html')
const _ = require('lodash')
const Category = require('../models/category')
const Tag =  require('../models/tags')
const { errorHandler } = require('../helpers/dbErrorHandler')
const fs = require('fs')
const {smartTrim} = require('../helpers/blog')

/// create a blog


exports.create = (req, res) => {
    let form =  new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, (err, fields, files) => {
        if(err){
            return res.status(400).json({
                error:'La imagen no se pudo cargar'
            })
        }
        const {title,body, categories, tags} = fields

        if(!title || !title.length){
            return res.status(400).json({
                error:'El titulo es Requerido'
            })
        }
        
        if(!body || body.length < 200 ){
            return res.status(400).json({
                error:'El contenido es muy corto'
            })
        }
        
        if(!categories || categories.length == 0){
            return res.status(400).json({
                error:'Al menos una categoria es necesaria'
            })
        }
        
        if(!tags || tags.length == 0){
            return res.status(400).json({
                error:'Al menos una etiqueta es requerida'
            })
        }
        
        let blog = new Blog();
        blog.title = title;
        blog.body = body;
        blog.excerpt = smartTrim(body, 200, '', '...');
        blog.slug = slugify(title).toLowerCase(); //
        blog.mtitle = `${title} | ${process.env.APP_NAME}`;
        blog.mdesc = stripHtml(body.substring(0,150));
        blog.postedBy = req.user._id;

        // categories and tags

        let arrayOfCategories = categories && categories.split(',')
        let arrayOfTags = tags && tags.split(',')



        if(files.photo) {
            if(files.photo.size > 10000000) {
                return res.status(400).json({
                    error:'La imagen debe de ser de menos de 1 MB'
                })
            }
            blog.photo.data = fs.readFileSync(files.photo.path)
            blog.photo.contentType = files.photo.type
        }
        blog.save((err, result) => {
            if(err){
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
           // res.json(result)
            Blog.findByIdAndUpdate(result._id, {$push:{categories: arrayOfCategories }},{new: true}).exec((err,result) => {
                if(err){
                    return res.status(400).json({
                        error: errorHandler(err)
                    })
                }  else{
                    Blog.findByIdAndUpdate(result._id,{$push: {tags: arrayOfTags}},{new:true }).exec((err,result) => {
                        if(err){
                            return res.status(400).json({
                                error: errorHandler(err)
                            })
                        } else {
                            res.json(result)
                        }
                    })
                }
            })
        })
    })
};




/// list blog

exports.list = (req,res) => {
    Blog.find({})
    .populate('categories','_id name slug')
    .populate('tags','_id name slug')
    .populate('postedBy','_id name username')
    .select('_id title slug excerpt categories tags postedBy createdAt updateAt')
    .exec((err,data) => {
        if (err){
            return res.json({
                error:errorHandler(err)
            })
        }  
        return res.json(data)
    })
}

// list with the categories and tags
// for default in front end we gonna return the limit to 10 posts


exports.listAllBlogsCategoriesTags = (req,res) => {
    let limit = req.body.limit ? parseInt(req.body.limit) : 10
    let skip  = req.body.skip ? parseInt(req.body.skip) : 0

    let blogs
    let categories
    let tags

    Blog.find({})
    .populate('categories','_id name slug')
    .populate('tags','_id name slug')
    .populate('postedBy','_id name username')
    .sort({createdAt: -1})
    .skip(skip)
    .limit(limit)
    .select('_id title slug excerpt categories tags postedBy createdAt updateAt')
    .exec((err,data) => {
        if (err) {
            return res.json({
                error:errorHandler(400)
            })
        } 
        blogs = data // blogs
        // get all categories
        Category.find({}).exec((err,c) => {
            if(err){
                return res.json({
                    error:errorHandler(err)
                })
            } 
            categories = c // categories
        Tag.find({}).exec((err,t) => {
                if(err){
                    return res.json({
                        error:errorHandler(err)
                    })
                } tags = t
                // return alll the blogs, categories & tags
                res.json({ blogs, categories, tags, size:blogs.length })
            })
        })
    })
}

// read one post

exports.read = (req,res) => {
    const slug = req.params.slug.toLowerCase()
    Blog.findOne({slug})
    .populate('categories','_id name slug')
    .populate('tags','_id name slug')
    .populate('postedBy','_id name username')
    .select('_id title slug mtitle mdesc categories tags postedBy createdAt updateAt')
    .exec((err, data) => {
        if (err){
            return res.json({
                error:errorHandler(err)
            })
        } res.json(data)
    })
}

// remove the post
exports.remove = (req,res) => {
    const slug = req.params.slug.toLowerCase()
    Blog.findOneAndRemove({slug}).exec((err, data) => {
        if (err){
            return res.json({
                error:errorHandler(err)
            })
        }  
        res.json({ 
            message:'EL Post se ha eliminado con éxito'
        })
    })
}


// update the post

exports.update = (req,res) => {
        
        const slug = req.params.slug.toLowerCase()
      
        Blog.findOne({slug}).exec((err, oldBlog) => {
            if(err){
                return res.status(400).json({
                    error:errorHandler(err)
                })
            }
            let form =  new formidable.IncomingForm()
            form.keepExtensions = true;

            form.parse(req, (err, fields, files) => {
                if(err){
                    return res.status(400).json({
                        error:'La imagen no se pudo cargar'
                    })
                }
               let slugBeforeMerge = oldBlog.slug
               oldBlog = _.merge( oldBlog, fields )
               oldBlog.slug = slugBeforeMerge
               
               const {body, mdesc, categories, tags} = fields
                
               if(body){
                    oldBlog.excerpt = smartTrim(body, 320, '', '...')
                    oldBlog.mdesc = stripHtml(body.substring(0,160))
                }

                if(categories){
                    oldBlog.categories = categories.split(',')
                    //oldBlog.mdesc = stripHtml(body.substring(0,160))
                }
                

                if(tags){
                    oldBlog.tags = tags.split(',')
                    //oldBlog.mdesc = stripHtml(body.substring(0,160))
                }
                
                if(files.photo) {
                    if(files.photo.size > 10000000) {
                        return res.status(400).json({
                            error:'La imagen debe de ser de menos de 1 MB'
                        })
                    }
                    oldBlog.photo.data = fs.readFileSync(files.photo.path)
                    oldBlog.photo.contentType = files.photo.type
                }
                oldBlog.save((err, result) => {
                    if(err){
                        return res.status(400).json({
                            error: errorHandler(err)
                        })
                    }
                   // res.json(result)
            
                           res.json(result) 
                        
                    })
                })
            })
        
    
    
}