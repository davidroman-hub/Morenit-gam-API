const Category = require('../models/category');
const { errorHandler } = require('../helpers/dbErrorHandler')
const slugify = require('slugify')

//// find category by id ////

exports.categoryById = (req,res,next,id) => {
    Category.findById(id).exec((err,category)=>{
        if(err||!category){
            return res.status(400).json({
                error:" La categoria no existe"
            })
        }
        req.category = category
        next()
    })
}

//// read method of category ////
exports.read = (req, res) => {
    const slug = req.params.slug.toLowerCase();

    Category.findOne({ slug }).exec((err, category) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(category);
    });
};



//// create category method //// 


exports.create = (req,res) => {
    const {name} = req.body
    let slug = slugify(name).toLowerCase()
    let category = new Category({name, slug})

    category.save((err, data) => {
        if(err){
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json({data})
    })
} 

//// category remove method ////


exports.remove = (req, res) => {
    const slug = req.params.slug.toLowerCase();

    Category.findOneAndRemove({ slug }).exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({
            message: 'Categoria Eliminada'
        });
    });
};

//// update category ////

exports.update = (req, res)=> {
    const category = req.category
    category.name = req.body.name
    category.save((err, data)=>{
        if(err){
            return res.status(400).json({
                error:errorHandler(err)
            });
        }
        res.json(data);
    });
};


//// category list method for show all of the categories ////

exports.list = (req,res)=>{
    Category.find().exec((err,data)=>{
        if(err) return res.status(400)({
            error:errorHandler(err)
        })
        res.json(data)
    })
}