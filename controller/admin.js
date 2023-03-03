const { response } = require("express");
const User = require("../model/user");

exports.loadUsers = async(request,response)=>{
    try {

        let {searchKey , limit,skip} = request.query;

        console.log("start")

        limit = +limit || 10;
        skip = +skip ?? 0;

        let userFound = await User.find({}).limit(limit).skip(skip).lean();

        let totalUser = await User.count();

        if(userFound.length<1){
            return response.status(404).json({
                success:false,
                messge:"user not found"
            })
        }

        return response.status(404).json({
            success:true,
            messge:"success",
            data:userFound,
            totalUser
        })

        
    } catch (error) {
        console.log("error",error);
        return response.status(500).json({
            success:false,
            messge:error.messge
        })
    }
}