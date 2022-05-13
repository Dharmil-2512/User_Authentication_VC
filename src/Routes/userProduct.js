const router = require('express').Router();
const authUser = require('../middleware/auth');
const productController = require('../controller/productController');
const validator = require('express-joi-validation').createValidator({})
const joiValidation = require('../validators/index');



router.post('/addproduct', validator.body(joiValidation.productSchema), authUser.jwtValidation, productController.addProducts);
router.patch('/updateProduct/:id', authUser.jwtValidation, productController.updateProduct);
router.delete('/deleteProduct/:id', authUser.jwtValidation, productController.deleteProduct);
router.get('/getProducts/:id', authUser.jwtValidation, productController.getProduct);
router.get('/allProducts', authUser.jwtValidation, productController.productList)

module.exports = router;