const express = require('express');
const path = require('path');
const router = require('./Routes/index');
const userModel = require('./models/user');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const InitiateMongoServer = require("./config/db");



InitiateMongoServer();


const app = express();


const port = process.env.PORT || 3000;


app.use(bodyParser.json());


app.use('/public/upload/', express.static(path.join(__dirname, '../public/upload/')))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(router);


app.set('view Engine', 'ejs');






app.listen(port, () => {
    console.log(`The server is running on port  ${port}`);
});