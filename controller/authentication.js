const { response, request } = require("express");
const user = require("../model/user");
const { v1: uuidv1 } = require('uuid');
const bcrypt = require("bcryptjs");
const validation = require("../helper/validate");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const {sendingEmail} = require("../helper/utils");

exports.register = async(request,response)=>{
    try {

        let {name,email,mobile,password ,confirmPassowrd, gender,role} = request.body;
        let message = "Invalid details !"

        let isValidName = isValidEmail = isValidMobile = isValidPassword = isValidGender = true;

        if(!name || !email || !mobile || !password || !confirmPassowrd || !gender){
            return response.status(403).json({
                success:false,
                message:"all field required"
            })
        }

        if(name){
            isValidName = validation.name(name);
            isValidName? message : message +=" name"
        }

        if(email){
            isValidEmail = validation.email(email);
            isValidEmail? message : message +=" email"
        }

        if(mobile){
            isValidMobile = validation.mobile(mobile);
            isValidMobile? message : message +=" mobile"
        }

        if(password){
            isValidPassword = validation.password(password);
            isValidPassword? message : message +=" password"
        }

        if(gender){
            
            isValidGender = validation.gender(gender);
            isValidGender? message : message +=" gender"
        }

        if(!isValidName || !isValidEmail || !isValidMobile || !isValidPassword || !isValidGender){
            return response.json({
                success:false,
                message:message
            })
        }


        //check mobile and email is exist or not...............
        let existMobile = await user.findOne({mobile:mobile}).lean()
        let existEmail = await user.findOne({email:email}).lean();


        
        if(existEmail || existMobile){
            return response.json({
                success:false,
                message:"with this mobile or email user is alerady exist"
            })
        }

        if(password && confirmPassowrd){
            if(password !== confirmPassowrd){
                return response.json({
                    success:false,
                    message:"password is not matched with confirm password"
                })
            }
        }

       

        // password encrption//

        let salt = await bcrypt.genSaltSync(10);
        let hashPassword = await bcrypt.hashSync(password,salt);
        
        const userRegister = new user({
            name: name,
            email: email,
            mobile: mobile,
            role,
            password: hashPassword
        })

        // save user...............

        const token = await userRegister.generateAuthToken()
        

        if(!token){
            return response.json({
                success:false,
                message:"internal server error"
            })
        }

        
        const result = await userRegister.save()

        if(!result){
            return response.json({
                success:false,
                message:"internal server error"
            })
        }

        result.password = undefined;
        result.token = undefined

       

        return response.json({
            success:true,
            message:"register successfully",
            data:result,
            sessionId:token
        })

    } catch (error) {
        console.log("error",error)
        
        return response.json({
            success:false,
            message:error.message
        })
    }
}

exports.verifyEmail = async (request,response)=>{
    try {

        let {email, token} = request.query;

        
        // check user and token.............
        let userFound = await user.findOne({email:email,emailVerifyToken:token}).lean();
        
        

        if(!userFound){
            return response.status(404).json({
                success:false,
                message:"not found"
            })
        }

        if(userFound && userFound.isEmailVerified){
            return response.status(403).json({
                success:false,
                message:"link expired"
            })
        }

        // update email is verified...........

        let updateUser = await user.findOneAndUpdate(
            {email:email},
            {isEmailVerified:true,emailVerifyToken:null},
            {new:true}
        )

        if(!updateUser){
            return response.status(500).json({
                success:false,
                message:"internal server error"
            })
        }

        return response.status(200).json({
            success:true,
            message:"email verified successfully"
        })


        
    } catch (error) {
        console.log(error)
        return response.status(404).json({
            success:false,
            message:error.message
        })
    }
}

exports.login = async(request,response)=>{
    try {

        let {email,phone,password} = request.body;
        let query={
            $or:[{email:email,phone:phone}]
            
        }
        let userFound = await user.findOne(query).lean();

        if(!userFound){
            return response.json({
                success:false,
                message:"wrong email or phone no"
            })
        }

        //verify password............
        
        let hashPassword = await bcrypt.compareSync(password,userFound.password);
        
        if (!hashPassword) {
            return response.json({
                success:false,
                message:"wrong password"
            })
        }

        // CHECK HOW MANY LOGINS............
        if(userFound.token.length===4){
            return response.status(403).json({
                success:false,
                message:"maximum login reached please logout from other devices for login"
            })
        }

        const token = await jwt.sign({_id:userFound._id.toString()},process.env.JWT_SECRET);

        if(!token){
            return response.status(500).json({
                success:false,
                message:"internal server error"
            })
        }

        userFound.token = [...userFound.token,token];
        
        
        let savedUser = await user.findOneAndUpdate({_id:userFound._id},userFound,{new:true});
        savedUser.token = undefined

        savedUser.password = undefined;
       

        return response.json({
            success:true,
            message:"login successfully",
            sessionId:token,
            data : savedUser
        })

    } catch (error) {
        console.log(error)
        return response.json({
            success:false,
            message:error.message
        })
    }
}

exports.logout =  async (request,response)=>{
    try {
        let userData = request.userData
        let token = request.headers.authorization

        // remove token from tokens...........
        let updateUser = await user.findOneAndUpdate(
            {_id:userData._id},
            {$pull : {token:token}},
            {new:true}
        )

        if(updateUser){
            return response.status(200).json({
                success:true,
                message:"logout successfully"
            })
        }
        else{
            return response.status(500).json({
                success:false,
                message:"Internal server error"
            })
        }
              
        

    } catch (error) {
        console.log(error)
        return response.json({
            success:false,
            message:error.message
        })
    }
}


exports.forgotPassword = async (request , response)=>{
    try {

        let {email} = request.body;

        // check email is exist for not...........
        let userFound = await user.findOne({email}).lean();

        if(!userFound){
            return response.status(403).json({
                success:false,
                message:"email not found"
            })
        }

        // send email for forgot password to user..............
        let res = await sendingEmail(userFound,"forgot-password");

        if(res == "error"){
            return response.status(500).json({
                success:false,
                message:"Internal server error"
            })
        }
        else{
            return response.json({
                success:true,
                message:"link sent to registered email"
            })
        }

        


        
    } catch (error) {
        console.log("error",error)
        return response.status(500).json({
            success:false,
            message:error.message
        })
    }
}


exports.resetPassword = async (request , response)=>{
    try {

        let {email,token} = request.query;
        let {password,confirmPassword} = request.body;

        // CHECK PASSWORD FORMAT.............

        if(!validation.password(password)){
            return response.status(403).json({
                success:false,
                message:"password length should be greater than 6 and combination of string ,number and a special character"
            })
        }

        if(password != confirmPassword){
            return response.status(403).json({
                success:false,
                message:"password doest not match connfirm password"
            })
        }


        // check user and token.............
        let userFound = await user.findOne({email:email,forgetPasswordToken:token}).lean();   
        

        if(!userFound){
            return response.status(404).json({
                success:false,
                message:"not found"
            })
        }

        // check time stamp................
        let tokenTime = new Date(userFound.forgetPasswordTokenTimeStamp)
        let currentTime = Date.now();
        let timeDiff = Math.floor((currentTime - tokenTime.getTime())/(1000));

       
        
        if(timeDiff >600){
            return response.status(410).json({
                success:false,
                message:"time expired please do again forgot password on website"
            })
        }
        

        // UPDATE NEW PASSWORD...........

        let salt = await bcrypt.genSaltSync(10);
        let hashPassword = await bcrypt.hashSync(password,salt);

        let updateUser = await user.findOneAndUpdate(
            {email},
            {password:hashPassword, forgetPasswordToken:null},
            {new:true}
        )

        if(!updateUser){
            return response.status(500).json({
                success:false,
                message:"Internal server error"
            })
        }

        else{
            return response.status(200).json({
                success:true,
                message:"successfully update password"
            })
        }
        
    } catch (error) {
        console.log("error",error)
        return response.status(500).json({
            success:false,
            message:error.message
        })
    }
}