const mongoose = require("mongoose");



const cartSchema = new mongoose.Schema({

    userId:{
        type: mongoose.Schema.Types.ObjectId,
         ref: 'users'
    },
    products:[{
        productId:{
            type: mongoose.Schema.Types.ObjectId,
         ref: 'product'
        },
        quantity:{
            type:Number
        },
        mrp:{
            type:Number
        },
        price:{
            type:Number
        },
        
        addedAt:{ type: Date, default: Date.now }
    }],
    
})



const cart = new mongoose.model("cart", cartSchema)

module.exports = cart