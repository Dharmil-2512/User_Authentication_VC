    const router = require('express').Router();
    const controller = require('../controller/user.controller');
    const validator = require('express-joi-validation').createValidator({})
    const joiValidation = require('../validators/index');







    router.post('/signup', validator.body(joiValidation.signupSchema), controller.signUp)
    router.get("/emailVerify/:EmailVerifyToken", controller.signUpVerification);
    router.post('/login', validator.body(joiValidation.loginSchema), controller.login);
    router.post("/forgotPassword", controller.forgotPassword);
    router.get("/resetPassword/:resetPasswordToken", (req, res) => {

        res.send(`Please Change Your Password  <br> ResetasswordToken:-${req.params.resetPasswordToken}`);
    });
    router.post('/resetPassword/:resetPasswordToken', controller.changePassword);



    module.exports = router;