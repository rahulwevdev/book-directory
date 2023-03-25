const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require('dotenv').config();

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        require: true
    },
    email:{
        type: String,
        require: true,
        unique:true
    },
    role:{
        type:String
    },
   
    mobile:{
        type: String,
        require: true,
        unique:true
    },
    gender:{
        type : String,
        enum:["male","female","transgender"],
        default:"male",
        require:true
    },
   
    password:{
        type:String
    },
    token:[],
   
    registerOn:{
        type:Date,
        default:Date.now()
    },
    active:{
        type:Boolean,
        default:true
    },
})

userSchema.methods.generateAuthToken = async function(next){
    try {
        const token = await jwt.sign({_id:this._id.toString()}, process.env.JWT_SECRET);
        this.token.push(token)
        await this.save();
        return token;
       
       
    } catch (error) {
        console.log(error);
        next()
    }
}

const user = new mongoose.model("user", userSchema)

module.exports = user