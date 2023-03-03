const User = require("../model/user");
const {
    v1: uuidv1,
    v4: uuidv4,
} = require('uuid');

exports.randomStringGenerate = async (x)=>{
    const randomString = require("randomstring");
    return randomString.generate(x);
}

exports.slugify = (string)=>{
    const slugify = require("slugify");
    return slugify(string)
}

exports.sendingEmail = async (userDetails, type) => {
    try {

        let string = uuidv4();

        // update uuid to user........
        let Query = {
            ...(type == "emailVerify" && { emailVerifyToken: string }),
            ...(type == "forgot-password" && { forgetPasswordToken: string, forgetPasswordTokenTimeStamp: Date.now() })

        }

        let updateUser = await User.findOneAndUpdate({ _id: userDetails._id }, Query, { new: true })

        if (!updateUser) {
            return "error"
        }

        let subject = "";
        let html = "";

        if (type == "emailVerify") {
            let url = `http://localhost:8000/email-verify?email=${userDetails.email}&token=${string}`;
        }

        if (type == "forgot-password") {
            let url = `http://localhost:8000/forgot-password?email=${userDetails.email}&token=${string}`;
        }

        return 

    } catch (error) {
        console.log("error", error);
        return "error"
    }
}