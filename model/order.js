const mongoose = require("mongoose");



const orderSchema = new mongoose.Schema({

    orderId: {
        type: String, unique: true, required: true
    },
    createdOn: { type: Date, default: Date.now },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
    products: [
        {
            _id: { type: String, unique: true, sparse: true },
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "product",
            },
            price: Number,
            mrp: Number,
            quantity: { type: Number, default: 1 },
        },
    ],
    sub_total: Number,
    total: Number,
    transactionId: { type: String, default: " " },
    address: {},
    paymentType: { type: String, default: "cod" },
    orderStatus: { type: String, default: "InProgress" },
    shippingCharges: { type: Number, default: 0 },

})



const order = new mongoose.model("order", orderSchema)

module.exports = order