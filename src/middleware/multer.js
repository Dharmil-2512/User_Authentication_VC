const multer = require('multer');

const path = require('path');
let storageEngine = multer.diskStorage({
    destination: function(req, file, cb) {

        cb(null, "public/upload");
    },
    filename: function(req, file, cb) {
        let fileName = Date.now() + '-' + file.originalname
        req.savedFileName = fileName
        cb(null, fileName)
    }
})
const typeArray = ["image/jpg", "image/jpeg", "image/png"];
exports.upload = multer({
    storage: storageEngine,



    fileFilter: function(req, file, cb) { // function to check file extension
        console.log("mimetype:", file.mimetype);
        if (typeArray.includes(file.mimetype)) {
            return cb(null, true)
        }

        return cb(new Error('extension is not valid', false));
    }
});