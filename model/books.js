const mongoose = require("mongoose");



const bookSchema = new mongoose.Schema({

    bookName:{
        type:String,
        require:true
    },
    bookCode:{
        type:String,
        require:true
    },
    generes:{
        type:String,
        require:true
    },
    authorName:{
        type:String,
        require:true
    },
    description:{
        type:String,
        require:true
    },
    price:{
        type:Number,
        require:true
    },
    publishDate:{type:Date},
    
    createdAt:{ type: Date, default: Date.now },
    updatedAt:{ type: Date, default: Date.now },
   

})



const book = new mongoose.model("books", bookSchema)

module.exports = book