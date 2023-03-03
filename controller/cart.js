const { request, response } = require("express");
const Product = require("../model/product");
const Cart = require("../model/cart");


exports.addCart = async (request, response) => {
  try {

    let { productId, quantity } = request.body;
    let userData = request.userData;

    let productFound = await Product.findOne({ _id: productId }).lean();

    if (!productFound) {
      return response.status(404).json({
        success: false,
        message: "product not found"
      })
    }

    // check product already in cart or not...........
    let cartFound = await Cart.findOne({
      userId: userData._id,
      products: {
        $elemMatch: { productId: productId }
      }
    }).lean()

    // product exist in cart............

    if (cartFound) {

      let productCart = cartFound.products.filter(item => item.productId.toString() == productId)[0]

      if (productCart.quantity + quantity > productFound.stock) {
        return response.status(403).json({
          success: false,
          message: "stock not available"
        })
      }

      let updateCart = await Cart.findOneAndUpdate(
        { userId: userData._id, products: { $elemMatch: { productId: productId } } },
        { $inc: { "products.$.quantity": quantity } },
        { new: true }
      )



      return response.status(200).json({
        success: true,
        message: "successfully item added to cart",
        cart: updateCart
      })



    }

    // first time product cart.........

    else {

      let cartObj = {
        productId,
        price: productFound.price,
        mrp: productFound.mrp,
        quantity: quantity
      }

      // if user doc not created.........
      let userCart = await Cart.findOne({ userId: userData._id }).lean();
      if (!userCart) {
        // create user cart .........
        let newCart = new Cart({ userId: userData._id });
        await newCart.save();
      }

      // add product to cart...................
      let addCart = await Cart.findOneAndUpdate(
        { userId: userData._id },
        { $push: { products: cartObj } },
        { new: true }
      ).lean()

      return response.status(200).json({
        success: true,
        message: "successfully item added to cart",
        cart: addCart
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

exports.loadCart = async (request,response)=>{
  try {

    const userData = request.userData;

    let cartDetails = {
      total:0,
      sub_total:0,
      totalMrp:0,
      tax:0,
      discount:0,
      shippingCost:0
    }

    let userCart = await Cart.findOne({userId:userData._id}).lean();

    if(!userCart){
      return response.status(200).json({
        success: true,
        message: "cart is empty",
        cart: cartDetails
      })
    }

    let total = 0;
    let sub_total = 0;
    let shippingCost = 0;
    let tax = 0;
    let discount = 0;
    let totalMrp = 0;

    userCart.products.map((item)=>{
      sub_total+= (item.price)*(item.quantity);
      totalMrp+= (item.mrp)*(item.quantity)
    })

    if(sub_total<500){
      shippingCost = 40;
    }

    total = sub_total+shippingCost;

    cartDetails.total = Math.round(total);
    cartDetails.sub_total = Math.round(sub_total);
    cartDetails.tax = Math.round(tax);
    cartDetails.totalMrp = Math.round(totalMrp);
    cartDetails.discount = Math.round(discount);
    cartDetails.shippingCost = shippingCost;

    return response.status(200).json({
      success: true,
      message: "success",
      cart: cartDetails
    })
    
  } catch (error) {
    console.log("error", error);
    return response.status(500).json({
      success: false,
      message: error.message
    })
  }
}

exports.removeFromCart = async (request, response) => {
  try {

    let { productId } = request.body;
    let userData = request.userData;

    let productFound = await Product.findOne({ _id: productId }).lean();

    if (!productFound) {
      return response.status(404).json({
        success: false,
        message: "product not found"
      })
    }

    // remove from cart..........
    let updateCart = await Cart.findOneAndUpdate(
      { userId: userData._id, products: { $elemMatch: { productId: productId } } },
      { $pull: { "products": { productId: productId } } },
      { new: true }
    )

    if (updateCart) {
      return response.status(200).json({
        success: true,
        message: "successfully item remove from cart"
      })
    }
    else {
      return response.status(500).json({
        success: false,
        message: "internal server error"
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

exports.updateCart = async (request, response) => {
  try {

    const { productId, quantity } = request.body;
    const userData = request.userData;

    let userCart = await Cart.findOne({ userId: userData._id, products: { $elemMatch: { productId: productId } } })
    .populate("products.productId", "stock")
    .lean();


    let cartProd = userCart.products.filter(item => item.productId._id.toString() == productId)[0];


    if (cartProd.productId.stock < quantity) {
      return response.status(403).json({
        success: false,
        message: "stock not available"
      })
    }

    // update guest user cart..........

    let updateCart = await Cart.findOneAndUpdate(
      { userId: userData._id, products: { $elemMatch: { "productId": productId } } },
      { "products.$.quantity": quantity },
      { new: true }
    ).lean()

    if (!updateCart) {
      return response.status(500).json({
        success: false,
        message: "some error has occured"
      })
    }

    return response.status(200).json({
      success: true,
      message: "cart updated successfully"
    })



  } catch (error) {
    console.log("error", error);
    return response.status(500).json({
      success: false,
      message: error.message
    })
  }
}