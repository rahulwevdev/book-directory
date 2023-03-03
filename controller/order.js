const { request, response } = require("express");
const User = require("../model/user");
const {
    randomStringGenerate
} = require("../helper/utils");
const Cart = require("../model/cart");
const Order = require("../model/order");

exports.createOrder = async (request, response) => {
    try {

        let {address,txnId,paymentType} = request.body;

        txnId = txnId || ""
        paymentType = paymentType || "cod";

        let userData = request.userData;

        if(!address){
            let user  = await User.findOne({_id:userData._id}).lean();
            let userAdd = user.address;
            if(Object.keys(userAdd).length == 0){
                return response.status(403).json({
                    success: false,
                    message: "please add address"
                }) 
            }
            address = userAdd;
        }

        let orderId = await randomStringGenerate(10);
        let createdBy = userData._id;
        
        //get products from cart...............
        let userCart = await Cart.findOne({userId:userData._id}).lean();

        if(userCart.products.length == 0){
            return response.status(403).json({
                success: false,
                message: "cart is empty"
            }) 
        }

        products = userCart.products;

        let total = 0;
        let sub_total = 0;
        let shippingCharges = 0

        products.map((item)=>{
            sub_total += (item.price)*(item.quantity);
        })

        if(sub_total<500){
            shippingCharges = 40
        }

        total = sub_total+shippingCharges;

        let createOrder = await Order({
            orderId,
            createdBy,
            products,
            sub_total,
            total,
            shippingCharges,
            address,
            paymentType,
            transactionId:txnId
        })
        
        let saveOrder = await createOrder.save();
        if(!saveOrder){
            return response.status(500).json({
                success: false,
                message: "some error has occured"
            }) 
        }
        else{
            let updateUserCart = await Cart.findOneAndUpdate(
                {userId:userData._id},
                {products:[]}
            )

            return response.status(200).json({
                success: true,
                message: "order created successfully",
                data:saveOrder
            }) 
            
        }



    } catch (error) {
        console.log("error", error);
        return response.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.loadById = async (request, response)=>{
    try {

        let {id} = request.params;

        console.log("s",request.params)

        let order = await Order.findOne({_id:id})
        .populate("products.productId")
        .lean();

        if(!order){
            return response.status(404).json({
                success: false,
                message: "order not found"
            }) 
        }
        return response.status(200).json({
            success: true,
            message: "success",
            data:order
        }) 
        
    } catch (error) {
        console.log("error", error);
        return response.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.loadOrders = async (request,response)=>{
    try {

        let {limit,skip,searchKey} = request.body;

        let userData = request.userData;

       

        let regex = { $regex: searchKey, $options: "$i" }
        let searchQuery = {
            $or: [
                { "orderId": regex },
                { "orderStatus": regex },
               
            ]
        }

        let Query = {}

        Query = {
            ...(searchKey && searchQuery),
            // ...(userData.role == "customer" &&{"createdBy._id":userData._id})
        }

        console.log("Query",Query)

        let orderFound = await Order.aggregate([

            {
                $lookup: {
                    from: "users",
                    localField: "createdBy",
                    foreignField: "_id",
                    as: "createdBy"
                }
            },
            { $unwind: "$createdBy" },

            {
                $lookup: {
                    from: "products",
                    localField: "products.productId",
                    foreignField: "_id",
                    as: "product"
                }
            },


            // { $unwind: "$brand" },
            // {
            //     $lookup: {
            //         from: "categories",
            //         localField: "category",
            //         foreignField: "_id",
            //         as: "category"
            //     }
            // },
            // { $unwind: "$category" },
              
            { $match: Query },
            {$sort:{createdOn:-1}}


        ]) 

        if(orderFound.length<1){
            return response.status(404).json({
                success:false,
                message:"orders not found"
            })
        }

        // pagination ....
        let totalProducts = orderFound.length;
        limit = limit || 10;
        skip = skip ?? 0;

        

        orderFound = orderFound.slice(+skip,(+limit)+(+skip));

        return response.status(200).json({
            success:true,
            message:"success",
            data:orderFound,
            total:totalProducts
            
        })

        
    } catch (error) {
        console.log("error", error);
        return response.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.updateOrder = async(request,response)=>{
    try {

        let {orderId,status} = request.body;

        let updateOrder = await Order.findOneAndUpdate({_id:orderId},{orderStatus:status}).lean();

        if(!updateOrder){
            return response.status(404).json({
                success: false,
                message: "order not found"
            }) 
        }
        return response.status(200).json({
            success: true,
            message: "order updated successfully"
        }) 


        
    } catch (error) {
        console.log("error", error);
        return response.status(500).json({
            success: false,
            message: error.message
        })
    }
}