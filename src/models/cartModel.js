const mongoose = require('mongoose');



const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product'
    },
    productName: {
        type: String,
        required: true

    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1
    },
    subTotal: {
        type: Number,
        required: true,
        default: 0
    },
    isProductremovedfromcart: {
        type: Boolean,
        enum: [true, false],
        default: false
    },
}, { timestamps: true });

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;