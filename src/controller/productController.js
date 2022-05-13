const Product = require('../models/productsModel');
const mongoose = require('mongoose');

exports.addProducts = async(req, res) => {
    try {
        console.log('.../', req.user)

        const product = new Product({
            userId: req.user.id,
            quantity: req.body.quantity,
            productName: req.body.productName,
            description: req.body.description,
            price: req.body.price
        });
        console.log('product=====>', product)
        await product.save({ upsert: true })
        res.status(200).send({
            message: "product added successfuly",
            error: [],
            data: [product]

        });

    } catch (error) {
        console.log("error", error);
        res.status(400).send({
            message: "invalid credentials",
            error: [error]
        })
    }

}

exports.updateProduct = async(req, res) => {
    try {
        console.log('....//.....1', req.user)
        const userProduct = await Product.findOneAndUpdate({ _id: req.params.id }, { productName: req.body.productName, description: req.body.description, quantity: req.body.quantity, price: req.body.price }, { new: true, upsert: true });

        console.log('../..', userProduct);
        res.status(200).send({
            message: "product updated successfully",
            error: [],
            data: [userProduct]
        })


    } catch (error) {
        console.log('error', error);
        res.status(400).send({
            message: "invalid credentials",
            error: [error]
        })
    }
}

exports.deleteProduct = async(req, res) => {
    try {

        const userProduct = await Product.findOneAndDelete({ _id: req.params.id });

        res.status(200).send({
            message: `product ${userProduct.productName} successfully removed from database`
        })

    } catch (error) {
        console.log('error', error);
        res.status(400).send({
            message: "invalid credentials",
            error: [error]
        })
    }
}

exports.getProduct = async(req, res) => {
    try {
        console.log('param', req.params.id)
        const products = await Product.findOne({ userId: mongoose.Types.ObjectId(req.params.id) })
        console.log("🚀 ~ file: productController.js ~ line 79 ~ exports.getProduct=async ~ products", products)
        if (!products) {
            res.status(404).send({
                message: "Product not found"
            })
        } else {
            res.status(200).send({
                message: "succefully get product",
                data: [products]
            })
        }
    } catch (error) {
        res.status(400).send({
            message: "cannot get products",
            error: [error]
        })
    }
}

exports.productList = async(req, res) => {
    try {
        const products = await Product.find({});
        console.log(products)
        res.status(200).send({
            message: "All the products are here",
            data: [products]
        });
    } catch (error) {
        res.status(400).send(error)
    }

}