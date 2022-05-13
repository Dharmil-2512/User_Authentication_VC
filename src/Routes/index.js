// require("dotenv").config();
const express = require('express');
const router = express.Router();
const userAuth = require('../Routes/userAuth');
const product = require('../Routes/userProduct');
const cart = require('../Routes/userCart')
const profile = require('../Routes/userProfile');
const purchase = require('./userPurchase');
const createHttpError = require('http-errors');



router.use(express.json());



router.use('/user', userAuth);
router.use('/Profile', profile);
router.use('/product', product);
router.use('/cart', cart)
router.use('/purchase', purchase)

router.use((req, res, next) => {
    next(createHttpError(404));
})

//* Error Handler
router.use((err, req, res, next) => {
    res.status(err.status || 500);

    res.json({
        error: {

            status: err.status || 500,
            message: err.message
        }
    })
});



module.exports = router;