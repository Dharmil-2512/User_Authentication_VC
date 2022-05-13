const mongoose = require('mongoose');
//ObjectID is a unique identifier for every document created in mongoDB. We’ll need this to link every item created with the user that created it


const productSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    productName: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },

}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);

module.exports = Product;