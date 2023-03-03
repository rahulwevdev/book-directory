const mongoose = require("mongoose");



const categoriesSchema = new mongoose.Schema({

    name:{
        type:String,
        require:true
    },
    description:{
        type:String,
        require:true
    },
    
    createdAt:{ type: Date, default: Date.now },
   

})



const categories = new mongoose.model("categories", categoriesSchema)

module.exports = categories