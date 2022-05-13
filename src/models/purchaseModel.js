const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
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

    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    isProductpurchased: {
        type: Boolean,
        enum: [true, false],
        default: false
    }

}, { timestamps: true })

const Purchase = mongoose.model("Purchase", purchaseSchema);

module.exports = Purchase;