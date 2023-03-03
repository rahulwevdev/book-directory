const { response } = require("express");
const Brand = require("../model/brand");

exports.addBrand = async (request,response)=>{
    try {

        let {name,description} = request.body;
        if(!name || !description){
            return response.status(403).json({
                success:false,
                message:"Invalid details"
            })
        }

        let existBrand = await Brand.findOne({name:name}).lean();
        if(existBrand){
            return response.status(403).json({
                success:false,
                message:"brand already exist"
            })
        }

        let newBrand = new Brand(request.body);
        let saveBrand = await newBrand.save();

        if(!saveBrand){
            return response.status(500).json({
                success:false,
                message:"Internal server error"
            })
        }
        else{
            return response.status(200).json({
                success:true,
                message:"success",
                brand:saveBrand
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

exports.loadBrand = async (request,response)=>{
    try {

        // let {brandId} = request.body;
        let brandFound = await Brand.find({}).lean();
        if(brandFound.length<1){
            return response.status(404).json({
                success:false,
                message:"brand not found"
            })
        }
        

        return response.status(200).json({
            success:true,
            message:"success",
            data:brandFound
        })
        
      
            
        
    } catch (error) {
        console.log(error)
        return response.status(500).json({
            success:false,
            message:error.message
        })
    }
}

exports.updateBrand = async (request,response)=>{
    try {

        let {brandId,name , description} = request.body;

        let updateQuery = {
            ...(name && {name}),
            ...(description && {description})
        }

        let updateBrand = await Brand.findOneAndUpdate(
            {_id:brandId},
            updateQuery,
            {new:true}
        ).lean();

        if(!updateBrand){
            return response.status(500).json({
                success:false,
                message:"Internal server error"
            })
        }
        

        return response.status(200).json({
            success:true,
            message:"brand updated succesfully",
            data:updateBrand
        })
        
      
            
        
    } catch (error) {
        console.log(error)
        return response.status(500).json({
            success:false,
            message:error.message
        })
    }
}

exports.deleteBrand = async (request,response)=>{
    try {

        let {brandId} = request.body;
        let brandFound = await Brand.findOne({_id:brandId}).lean();
        if(!brandFound){
            return response.status(404).json({
                success:false,
                message:"brand not found"
            })
        }
        

        let deleteBrand = await Brand.deleteOne({_id:brandId});


        if(!deleteBrand){
            return response.status(500).json({
                success:false,
                message:"Internal server error"
            })
        }
        else{
            return response.status(200).json({
                success:true,
                message:"brand deleted succesfully",
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