const mongoose = require("mongoose");

const initiateMongoServer = () => {
    try {
        mongoose.connect("mongodb://localhost:27017/Locationdb", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("connected to DB successfully!");
    } catch (error) {
        console.log(error);
        throw error;
    }
};

module.exports = initiateMongoServer;
