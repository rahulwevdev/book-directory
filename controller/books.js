const { response } = require("express");
const Book = require("../model/books");
const {randomStringGenerate,checkObjectId} = require("../helper/utils");
const moment = require("moment");

exports.addBook = async (request,response)=>{
    try {

        const {bookName,generes,authorName,description,price,publishDate} = request.body;

        if(!bookName || !generes || !authorName || !description || !price){
            return response.status(403).json({
                success:false,
                message:"all fields are required"
            })
        }


        let bookCode = (await randomStringGenerate(6)).toLocaleUpperCase();

        const newBook = new Book({
            bookName,generes,authorName,description,price,bookCode,publishDate:moment(publishDate,"D/M/YY")
        })

        // save book documents....
        let saveBook = await newBook.save();

        if(saveBook){
            return response.status(200).json({
                success:true,
                message:"book successfully added",
                data:saveBook
            })
        }
        else{
            return response.status(500).json({
                success:false,
                message:"internal server error"
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

exports.loadBooks = async (request,response)=>{
    try {

        let {limit,skip,searchKey="",authorName="",generes="",price} = request.query || {}

        limit = +limit || 10;
        skip = +skip ?? 0;

        let regex = { $regex: searchKey, $options: "$i" }
        let searchQuery = {
            $or: [
                {bookName:regex},
                {generes:regex},
                {authorName:regex},
                {description:regex}
            ]
        }


        let query={
            ...(searchKey && searchQuery),
            ...(authorName && {authorName:{ $regex: authorName, $options: "$i" }}),
            ...(generes && {generes:{ $regex: generes, $options: "$i" }}),
            ...(price && {price:{$lte:+price}})
        }

       

        let bookFound = await Book.find(query).limit(limit).skip(skip).sort({createdAt:-1   }).lean();

        let totalBooks = await Book.count();



        if(bookFound.length<1){
            return response.status(404).json({
                success:false,
                message:"books not found"
            })
        }
        

        else{
            return response.status(200).json({
                success:true,
                message:"success",
                data:bookFound,
                totalBook :totalBooks
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

exports.deleteBook = async (request,response)=>{
    try {

        const {id} = request.params;

        if(!id){
            return response.status(403).json({
                success:false,
                message:"book id required"
            })
        }

        if(id && !checkObjectId(id)){
            return response.status(403).json({
                success:false,
                message:"invalid book id"
            })
        }

        // first find the book...
        let bookFound = await Book.findOne({_id:id}).lean();

        if(!bookFound){
            return response.status(404).json({
                success:false,
                message:"book not found"
            })
        }
        

       // delete a book...

        let deleteBook = await Book.deleteOne({_id:id});

        if(deleteBook){
            return response.status(200).json({
                success:true,
                message:"book deleted successfully"
            })
        }
        else{
            return response.status(500).json({
                success:false,
                message:"internal server error"
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

exports.updateBook = async (request,response)=>{
    try {

        const {bookId,bookName,authorName,price,generes,description,publishDate} = request.body;

        if(!bookId){
            return response.status(403).json({
                success:false,
                message:"book id required"
            })
        }

        if(bookId && !checkObjectId(bookId)){
            return response.status(403).json({
                success:false,
                message:"invalid book id"
            })
        }

        // first find the book...
        let bookFound = await Book.findOne({_id:bookId}).lean();

        if(!bookFound){
            return response.status(404).json({
                success:false,
                message:"book not found"
            })
        }
        

       // update a book...

       let updateQuery={
        ...request.body,
        ...{updatedAt:Date.now()}
       }

       delete updateQuery.bookId;

        let updateBook = await Book.findOneAndUpdate({_id:bookId},updateQuery,{new:true}).lean()

        if(updateBook){
            return response.status(200).json({
                success:true,
                message:"book updated successfully",
                data:updateBook
            })
        }
        else{
            return response.status(500).json({
                success:false,
                message:"internal server error"
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

exports.loadAuthors = async (request,response)=>{
    try {

        
        let authors = await Book.distinct("authorName").lean();

        if(authors.length<1){
            return response.status(404).json({
                success:false,
                message:"authors not found"
            })
        }
        
            return response.status(200).json({
                success:true,
                message:"success",
                data:authors
            })

        
        
    } catch (error) {
        console.log("error",error);
        return response.status(500).json({
            success:false,
            message:error.message
        })
    }
}

exports.loadGenres = async (request,response)=>{
    try {

        
        let generes = await Book.distinct("generes").lean();

        if(generes.length<1){
            return response.status(404).json({
                success:false,
                message:"generes not found"
            })
        }
        
            return response.status(200).json({
                success:true,
                message:"success",
                data:generes
            })

        
        
    } catch (error) {
        console.log("error",error);
        return response.status(500).json({
            success:false,
            message:error.message
        })
    }
}