const Blog = require('../models/blog')
const formidable = require('formidable')
const slugify = require('slugify')
const stripHtml = require('string-strip-html')
const _ = require('lodash')
const Category = require('../models/category')
const Tag =  require('../models/tags')
const { errorHandler } = require('../helpers/dbErrorHandler')
const fs = require('fs')

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