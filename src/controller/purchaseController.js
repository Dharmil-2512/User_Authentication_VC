const Product = require('../models/productsModel');
const mongoose = require('mongoose');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const nodeMailer = require('./nodemailer');




const Cart = require('../models/cartModel');

const Purchase = require('../models/purchaseModel');
const { cartSchema } = require('../validators');


exports.puchaseProduct = async(req, res) => {
    try {
        console.log(req.user);
        const cart = await Cart.find({ userId: req.user.id, isProductremovedfromcart: false }).populate('productId', ' _id productName quantity price description');
        const product = await Product.find({ userId: req.user.id });


        console.log('available products in cart', cart);

        if (cart.length == 0) {

            res.status(500).send({
                message: "Your Cart is Empty Please add products to Cart"
            })
        } else {





            let isOutofstock = false;
            let purchase = []
            for (let i = 0; i < cart.length; i++) {

                if (cart[i].quantity <= cart[i].productId.quantity) {


                    const purchaseProduct = new Purchase({
                        userId: cart[i].userId,
                        productId: cart[i].productId._id,
                        quantity: cart[i].quantity,
                        price: cart[i].subTotal
                    });

                    purchase.push(purchaseProduct);
                    const matchProduct = await Product.findOne({ _id: cart[i].productId._id });
                    matchProduct.quantity -= cart[i].quantity;
                    matchProduct.save();

                } else {


                    isOutofstock = true
                }

            }
            console.log('added product in purchase array', purchase);

            if (!isOutofstock) {

                const emptyCart = await Cart.updateMany({ isProductremovedfromcart: false }, { $set: { isProductremovedfromcart: true } });

                console.log('empty cart', emptyCart);

                const userCart = await Cart.find({ isProductremovedfromcart: true }).populate('productId', ' _id productName quantity price description');

                let isRemoved = false;
                userCart.forEach((items) => {
                    if (items.isProductremovedfromcart == true) {

                        isRemoved = true;


                    } else {
                        console.log('items are not removed from cart');
                    }
                })
                console.log('isromved', isRemoved)
                if (isRemoved == true) {
                    console.log('.../...', purchase);

                    const purchasedProducts = await Purchase.insertMany(purchase);
                    console.log(" purchasedProducts", purchasedProducts)




                    const purchased = await Purchase.find({ userId: req.user.id, isProductpurchased: false }, { userId: true, productId: true, quantity: true, price: true }).populate('userId', 'name').populate('productId', 'productName');
                    console.log("purchase", purchased);


                    await Purchase.updateMany({ isProductpurchased: false }, { $set: { isProductpurchased: true } });
                    const totalPrice = await Purchase.aggregate([

                        {
                            $group: { _id: null, Total: { $sum: "$price" } }

                        }
                    ])
                    console.log(" totalPrice", totalPrice)

                    const price = totalPrice[0].Total;

                    const productList = await Purchase.find({ userId: req.user.id, isProductpurchased: true });






                    function generateUserInformation(doc, purchased) {
                        doc.font('Times-Roman').text("Purchased Items ", { align: 'center' }, 160, 170)
                        doc.text(`Date: ${new Date()}`, 200, 200)

                        doc.text(`Items: ${productList}`, { align: 'justify', width: 410 }, 230, 230).moveDown();
                        doc.text(`TotalPrice:${price}`, { align: 'justify', width: 410 })


                        .moveDown();
                    }


                    function create_PDF() {
                        let doc = new PDFDocument({ margin: 50 })
                        doc.pipe(fs.createWriteStream(path.join(__dirname, '../PurchasedItems/purchased.pdf')));

                        generateUserInformation(doc, productList);

                        doc.end();
                    }
                    create_PDF()

                    const email = req.user.email;

                    nodeMailer.purchasedInvoice(email);







                    return res.status(200).send({
                        message: "successfully purchased",
                        data: purchased
                    })
                }

            } else {
                await Cart.updateMany({ isProductremovedfromcart: true }, { $set: { isProductremovedfromcart: false } });

                return res.status(404).send({
                    message: "Your Cart is Empty Please add products to Cart"
                })
            }
        }





    } catch (error) {
        console.log('purchase error', error);
        res.status(404).send({
            message: "product not found in Cart",
            error: [error]
        })
    }
}