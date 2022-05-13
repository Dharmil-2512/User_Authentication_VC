const dotenv = require('dotenv').config();
const jwt = require("jsonwebtoken");

exports.jwtValidation = function jwtValidation(req, res, next) {
    try {
        const authHeader = req.headers['authorization'];


        const token = authHeader && authHeader.split(' ')[1]


        if (token === null) return res.sendStatus(401)



        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        console.log('deocoded', decoded.user);
        req.user = decoded.user;
        next();
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Token is not valid" });
    }
}