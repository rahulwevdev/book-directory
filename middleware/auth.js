const jwt = require("jsonwebtoken");
const { response } = require("..");
const user = require("../model/user");
require('dotenv').config();

exports.auth = () => {
    return async (request, response, next) => {

        try {


            let token = (request.headers.authorization);

            if (!token) {
                return response.status(400).json({
                    success: false,
                    message: "unkown user"
                })
            }



            let userDetails = await jwt.verify(token, process.env.JWT_SECRET);
            


            if (!user) {
                return response.status(400).json({
                    success: false,
                    message: "unkown user"
                })
            }

            let userFound = await user.findOne({ _id: userDetails._id }).lean();

            if (!userFound) {
                return response.status(400).json({
                    success: false,
                    message: "unkown user"
                })
            }

            request.userData = userFound;

            next()

        } catch (error) {
            
            return response.status(400).json({
                success: false,
                message: "invalid user"
            })
        }
    }
}
