const router = require('express').Router();
const authUser = require('../middleware/auth');
const cartController = require('../controller/cart.controller');
const validator = require('express-joi-validation').createValidator({})
const joiValidation = require('../validators/index');


router.get('/getCart', authUser.jwtValidation, cartController.getCart);
router.post('/userCart', validator.body(joiValidation.cartSchema), authUser.jwtValidation, cartController.createCart)
router.delete('/removeCart/:id', authUser.jwtValidation, cartController.removeCart)

module.exports = router;