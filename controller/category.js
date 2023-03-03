const { response } = require("express");
const Category = require("../model/categories");

exports.addCategory = async (request,response)=>{
    try {

        let {name,description} = request.body;
        if(!name || !description){
            return response.status(403).json({
                success:false,
                message:"Invalid details"
            })
        }

        let existCategory = await Category.findOne({name:name}).lean();
        if(existCategory){
            return response.status(403).json({
                success:false,
                message:"category already exist"
            })
        }

        let newCategory = new Category(request.body);
        let saveCategory = await newCategory.save();

        if(!saveCategory){
            return response.status(500).json({
                success:false,
                message:"Internal server error"
            })
        }
        else{
            return response.status(200).json({
                success:true,
                message:"success",
                data:saveCategory
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

exports.loadCategory = async (request,response)=>{
    try {

        // let {brandId} = request.body;
        let categoryFound = await Category.find({}).lean();
        if(categoryFound.length<1){
            return response.status(404).json({
                success:false,
                message:"category not found"
            })
        }
        

        return response.status(200).json({
            success:true,
            message:"success",
            data:categoryFound
        })
        
      
            
        
    } catch (error) {
        console.log(error)
        return response.status(500).json({
            success:false,
            message:error.message
        })
    }
}

exports.updateCategory = async (request,response)=>{
    try {

        let {categoryId,name , description} = request.body;

        let updateQuery = {
            ...(name && {name}),
            ...(description && {description})
        }

        let updateCategory = await Category.findOneAndUpdate(
            {_id:categoryId},
            updateQuery,
            {new:true}
        ).lean();

        if(!updateCategory){
            return response.status(500).json({
                success:false,
                message:"Internal server error"
            })
        }
        

        return response.status(200).json({
            success:true,
            message:"category updated succesfully",
            data:updateCategory
        })
        
      
            
        
    } catch (error) {
        console.log(error)
        return response.status(500).json({
            success:false,
            message:error.message
        })
    }
}

exports.deleteCategory = async (request,response)=>{
    try {

        let {categoryId} = request.body;
        let categoryFound = await Category.findOne({_id:categoryId}).lean();
        if(!categoryFound){
            return response.status(404).json({
                success:false,
                message:"category not found"
            })
        }
        

        let deleteCategory = await Category.deleteOne({_id:categoryId});


        if(!deleteCategory){
            return response.status(500).json({
                success:false,
                message:"Internal server error"
            })
        }
        else{
            return response.status(200).json({
                success:true,
                message:"category deleted succesfully",
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