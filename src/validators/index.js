const Joi = require('Joi');

exports.signupSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(30)
        .trim(true)
        .required(),

    email: Joi.string()
        .email({ minDomainSegments: 2 })
        .trim(true)
        .lowercase()
        .required(),

    image: Joi.string()
        .required(),

    password: Joi.string()
        .min(5)
        .trim(true)
        .required(),
})



exports.loginSchema = Joi.object({
    email: Joi.string()
        .email({ minDomainSegments: 2 })
        .lowercase()
        .required(),

    password: Joi.string()
        .min(5)
        .required(),

})



exports.profileSchema = Joi.object({

    name: Joi.string()
        .min(3)
        .trim(true)
        .required(),
    image: Joi.required()

})
exports.productSchema = Joi.object({
    productName: Joi.string()
        .required(),
    quantity: Joi.number()
        .required(),

    description: Joi.string()
        .required(),
    price: Joi.number()
        .required()

})

exports.cartSchema = Joi.object({
    productId: Joi.string()
        .required(),
    quantity: Joi.number()
        .required()

})