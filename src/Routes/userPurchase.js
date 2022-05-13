const router = require('express').Router();
const purchaseController = require('../controller/purchaseController');
const authUser = require('../middleware/auth');
const validator = require('express-joi-validation').createValidator({})
const joiValidation = require('../validators/index');

router.post('/purchaseProduct', authUser.jwtValidation, purchaseController.puchaseProduct)

module.exports = router;