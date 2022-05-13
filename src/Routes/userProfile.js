const router = require('express').Router();
const authUser = require('../middleware/auth');
const controller = require('../controller/user.controller');
const validator = require('express-joi-validation').createValidator({})
const joiValidation = require('../validators/index');
const { upload } = require('../middleware/multer');

router.post('/imageUpload', upload.single('image'), controller.upload);
router.get('/getProfile', authUser.jwtValidation, controller.getProfile);
router.post('/updateProfile', validator.body(joiValidation.profileSchema), authUser.jwtValidation, controller.updateProfile);

module.exports = router;