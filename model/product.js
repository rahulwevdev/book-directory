const mongoose = require("mongoose");



const productSchema = new mongoose.Schema({

    name:{
        type:String,
        require:true
    },
    description:{
        type:String,
        require:true
    },
    sku:{
        type:String,
        require:true
    },
    slug:{
        type:String,
        require:true
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'categories'
    },
    brand:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'brand'
    },
    images:[String],
    mrp:{
        type:Number,
        require:true
    },
    price:{
        type:Number,
        require:true  // gst included
    },
    discount: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    gst: { type: Number, default: 0 },
    hsnCode: String,
    active: { type: Boolean, default: true },
    datePosted:{ type: Date, default: Date.now },
    updatedAt:{ type: Date, default: Date.now },





})



const product = new mongoose.model("product", productSchema)

module.exports = product