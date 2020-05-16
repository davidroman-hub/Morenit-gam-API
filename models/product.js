const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema

const postSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            trim:true,
            required:true,
            maxlength:32
        },
        description:{
            type:String,
            required:true,
            maxlength:200000
        },
        category:{
            type:ObjectId, // that why i brought the object id , when i create the category it will be here.
            ref:'Category',// this is the name of the category name ;)
            required:true
        },
        photo: {
            data: Buffer,
            contentType: String
        },
        description2:{
            type:String,
            required:true,
            maxlength:200000
        },
        photo2: {
            data: Buffer,
            contentType: String
        }
    },
    {timestamps:true}
);

module.exports = mongoose.model("Post", postSchema);