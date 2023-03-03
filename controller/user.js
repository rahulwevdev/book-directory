const { request, response } = require("express");
const User = require("../model/user");
const validatation = require("../helper/validate");
const { Query } = require("mongoose");

exports.loadProfile =async (request,response)=>{
    try {

        let userData = request.userData;

        let userFound = await User.findOne({_id:userData._id}).lean();

        userFound.token = undefined;
        userFound.salt = undefined

        if(!userFound){
            return response.status(403).json({
                success:false,
                message:"user not found"
            })
        }

        return response.status(200).json({
            success:true,
            message:"success",
            data: userFound
        })

        
    } catch (error) {
        return response.status(500).json({
            success:false,
            message:error.message
        })
    }
}

exports.updateProfile = async (request, response)=>{
    try {

        let userData = request.userData;
        let {name,mobile,gender,paymentDetails={}} = request.body;


        let updateQuery ={}


        if(name){
            let val = validatation.name(name);
            if(!val){
                return response.status(403).json({
                    success:false,
                    message:"invalid name"
                })
            }

            updateQuery.name = name
        }

        if(mobile){
            let val = validatation.mobile(mobile);
            if(!val){
                return response.status(403).json({
                    success:false,
                    message:"invalid mobile"
                })
            }
            updateQuery.mobile = mobile
        }

        if(gender){
            let val = validatation.gender(gender);
            if(!val){
                return response.status(403).json({
                    success:false,
                    message:"invalid gender"
                })
            }

            updateQuery.gender = gender
        }

        let paymentDetailObj = Object.keys(paymentDetails);
        if(paymentDetailObj.length>0){
            
            let {status,statusMessage} = validatation.paymentInfoValidate(paymentDetails);
            if(!status){
                return response.status(403).json({
                    success:false,
                    message:statusMessage
                })
            }

            let {upiNumber,accountNumber,ifscCode,accountName,bankAccountName,creditCardNumber} = paymentDetails || {}

           

            // update Query ..............
            updateQuery = {
                ...updateQuery,
                ...(upiNumber && {"paymentDetails.upiNumber":upiNumber}),
                ...(accountNumber && {"paymentDetails.accountNumber":accountNumber}),
                ...(accountName && {"paymentDetails.accountName":accountName}),
                ...(bankAccountName && {"paymentDetails.bankAccountName":bankAccountName}),
                ...(ifscCode && {"paymentDetails.ifscCode":ifscCode}),
                ...(creditCardNumber && {"paymentDetails.creditCardNumber":creditCardNumber})
            } 
        }

      

        // update user info ...............

        let updateUserInfo = await User.findOneAndUpdate(
            {_id : userData._id},
            updateQuery,
            {new:true}
        )

        if(!updateUserInfo){
            return response.status(500).json({
                success:false,
                message:"Internal server error"
            })
        }

        return response.status(200).json({
            success:true,
            message:"successfully updated",
            data : updateUserInfo
        })



        
    } catch (error) {
        console.log("error",error)
        return response.status(500).json({
            success:false,
            message:error.message
        })
    }
}

exports.addAddress = async (request,response)=>{
    try {

        let userData = request.userData;

        let pushUserAdd = await User.findOneAndUpdate(
            {_id:userData._id},
            {address:request.body},
            {new:true}
        )

        if(pushUserAdd){
            return response.status(200).json({
                success:true,
                message:"successfully address",
                data: pushUserAdd
            })
        }
        else{
            return response.status(500).json({
                success:false,
                message:"some error has occured"
            })
        }


        
    } catch (error) {
        console.log("error",error);
        return response.status(500).json({
            success:false,
            message:error.message
        })
    }
}