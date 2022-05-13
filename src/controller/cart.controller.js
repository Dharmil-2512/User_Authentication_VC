const Cart = require('../models/cartModel');

const Product = require('../models/productsModel');

exports.getCart = async(req, res) => {
    try {
        console.log('..req.user', req.user);

        const cart = await Cart.find({ userId: req.user.id, isProductremovedfromcart: false });
        console.log('cart', cart);


        if (cart) {
            if (cart == "") {
                res.send({
                    message: "Cart is empty"
                })
            } else {
                res.status(200).send({
                    message: "products That are Added to Cart by User",
                    products: [cart]
                });
            }
        } else {
            res.send(null);
        }


    } catch (err) {
        console.log('cart error', err);
        res.status(404).send({
            message: "cart not found",
            error: [err]
        })
    }

}

exports.createCart = async(req, res) => {

    try {
        console.log('..../....', req.body.productId)

        const product = await Product.findOne({ _id: req.body.productId })
        console.log('product', product);

        const existCart = await Cart.findOne({ productId: req.body.productId, userId: req.user.id });
        if (existCart) {


            existCart.quantity += req.body.quantity;
            console.log(existCart)

            if (existCart.quantity <= product.quantity && existCart.isProductremovedfromcart == false) {
                await existCart.save();
                res.status(200).send({
                    message: "product added to cart",
                    data: [existCart]
                });
            } else {
                res.status(400).send({
                    message: "No such quantity of products available",

                });
            }


        } else {

            if (req.body.quantity <= product.quantity) {
                const newCart = new Cart({
                    userId: req.user.id,
                    productId: product._id,
                    productName: product.productName,
                    quantity: req.body.quantity,
                    subTotal: req.body.quantity * product.price
                });


                await newCart.save()




                res.status(200).send({
                    message: "product added to cart",
                    data: [newCart]
                });
            } else {
                res.status(400).send({
                    message: "No such quantity of products available",

                });
            }
        }



    } catch (error) {
        console.log('cart error', error);
        res.status(500).send({
            message: "product not added to cart",
            error: [error]

        })
    }
}

exports.removeCart = async(req, res) => {
    try {
        const removeCart = await Cart.findOneAndDelete({ _id: req.params.id });
        console.log('cart', removeCart);
        res.status(200).send({
            message: `product ${removeCart.productName} successfully removed from database`
        })
    } catch (err) {
        console.log('cart error', err);
        res.status(404).send({
            message: "cart not found",
            error: [err]
        })
    }
}