const { request, response } = require("express");
const Product = require("../model/product");
const Brand = require("../model/brand");
const Category = require("../model/categories");
const {slugify} = require("../helper/utils");
const ObjectId = require('mongodb').ObjectId;

exports.addProduct = async (request,response)=>{
    try {

        let {name,description,sku,brand,category,mrp,price,stock,gst,hsnCode} = request.body;

        if(!name  || name == ""){
            return response.status(403).json({
                success:false,
                message:"Invalid name"
            })
        }
        if(!description  || description == ""){
            return response.status(403).json({
                success:false,
                message:"Invalid description"
            })
        }

        if(!sku  || sku == ""){
            return response.status(403).json({
                success:false,
                message:"Invalid sku"
            })
        }
        if(!hsnCode  || hsnCode  == ""){
            return response.status(403).json({
                success:false,
                message:"Invalid hsnCode"
            })
        }
        if(!mrp  || typeof mrp  != "number"){
            return response.status(403).json({
                success:false,
                message:"Invalid mrp"
            })
        }
        if(!price  || typeof price  != "number"){
            return response.status(403).json({
                success:false,
                message:"Invalid price"
            })
        }
        if(!stock  || typeof stock  != "number"){
            return response.status(403).json({
                success:false,
                message:"Invalid stock"
            })
        }
        
        if(!gst  || typeof gst  != "number"){
            return response.status(403).json({
                success:false,
                message:"Invalid stock"
            })
        }

        let brandFound = await Brand.findOne({_id:brand}).lean();
        if(!brandFound){
            return response.status(404).json({
                success:false,
                message:"brand not found"
            })
        }

        let categoryFound = await Category.findOne({_id:category}).lean();

        if(!categoryFound){
            return response.status(404).json({
                success:false,
                message:"category not found"
            })
        }

        let discount = mrp-price;
        let slug = slugify(name);
      

        // check product already exist.........
        let productExist = await Product.find({$or:[{name:name},{slug:slug}]}).lean();

        if(productExist.length>0){
            return response.status(403).json({
                success:false,
                message:"product this name already exist"
            })
        }

        let newProduct = new Product({...request.body,...{discount:discount,slug:slug}});
        let saveProduct = await newProduct.save();

        if(!saveProduct){
            return response.status(500).json({
                success:false,
                message:"internal server error"
            })
        }
        else{
            return response.status(200).json({
                success:true,
                message:"successfully product added",
                data:saveProduct
            })
        }



    } catch (error) {
        console.log(error)
        return response.status(500).json({
            success:false,
            message:error.message
        })
    }
}

exports.loadById = async (request, response)=>{
    try {

        let {id} = request.params;


        let product = await Product.findOne({_id:id})
        .populate("brand")
        .populate("category")
        .lean();

        if(!product){
            return response.status(404).json({
                success: false,
                message: "product not found"
            }) 
        }
        return response.status(200).json({
            success: true,
            message: "success",
            data:product
        }) 
        
    } catch (error) {
        console.log("error", error);
        return response.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.loadBySlug =  async (request,response)=>{
    try {

        let {slug} = request.params;


        let product = await Product.findOne({slug:slug})
        .populate("brand")
        .populate("category")
        .lean();

        if(!product){
            return response.status(404).json({
                success: false,
                message: "product not found"
            }) 
        }
        return response.status(200).json({
            success: true,
            message: "success",
            data:product
        }) 
        
    } catch (error) {
        console.log("error", error);
        return response.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.loadProducts = async (request,response)=>{
    try {

        let {limit,skip,searchKey,brand,category,minPrice,maxPrice} = request.query || {};

        let regex = { $regex: searchKey, $options: "$i" }
        let searchQuery = {
            $or: [
                { "brand.name": regex },
                { "brand.description": regex },
                { name: regex },
                {slug:regex},
                { sku: regex },
                {"category.name":regex},
                { "category.description": regex },
            ]

        }

        let Query = {}

        Query = {
            ...(searchKey && searchQuery),
            ...(brand && {"brand._id":ObjectId(brand)}),
            ...(category && {"category._id":ObjectId(category)}),
            ...(minPrice && maxPrice && { price: { $gte: +minPrice, $lte: +maxPrice } })
        }


     

        let productFound = await Product.aggregate([

            {
                $lookup: {
                    from: "brands",
                    localField: "brand",
                    foreignField: "_id",
                    as: "brand"
                }
            },


            { $unwind: "$brand" },
            {
                $lookup: {
                    from: "categories",
                    localField: "category",
                    foreignField: "_id",
                    as: "category"
                }
            },
            { $unwind: "$category" },
              
            { $match: Query },
            {$sort:{datePosted:-1}}


        ]) 

        if(productFound.length<1){
            return response.status(404).json({
                success:false,
                message:"products not found"
            })
        }

        // pagination ....
        let totalProducts = productFound.length;
        limit = limit || 10;
        skip = skip ?? 0;

        

        productFound = productFound.slice(+skip,(+limit)+(+skip));

        return response.status(200).json({
            success:true,
            message:"success",
            data:productFound,
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