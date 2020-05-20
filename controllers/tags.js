const Tag = require('../models/tags');
const { errorHandler } = require('../helpers/dbErrorHandler')
const slugify = require('slugify')

//// find category by id ////


//// read method of category ////
exports.read = (req, res) => {
    const slug = req.params.slug.toLowerCase();

    Tag.findOne({ slug }).exec((err, tag) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(tag);
    });
};


//// create category method //// 


exports.create = (req,res) => {
    const {name} = req.body
    let slug = slugify(name).toLowerCase()
    let tag = new Tag({name, slug})

    tag.save((err, data) => {
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

    Tag.findOneAndRemove({ slug }).exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({
            message: 'Etiqueta eliminada'
        });
    });
};


//// category list method for show all of the categories ////

exports.list = (req,res)=>{
    Tag.find().exec((err,data)=>{
        if(err) return res.status(400)({
            error:errorHandler(err)
        })
        res.json(data)
    })
}