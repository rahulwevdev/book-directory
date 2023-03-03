const mongoose = require("mongoose");



const brandSchema = new mongoose.Schema({

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



const brand = new mongoose.model("brand", brandSchema)

module.exports = brand