const mongoose = require("mongoose");

// Replace this with your MONGOURI.
console.log("🚀 ~ file: db.js:5 ~  process.env.URL", process.env.URL);

const InitiateMongoServer = () => {
  mongoose.Promise = global.Promise;

  mongoose.set("debug", false);
  mongoose
    .connect(process.env.URL, {
      useNewUrlParser: true,
    })
    .then(
      () => {
        console.log("Database Connected");
      },
      (err) => {
        console.log("connection issue ", err);
        mongoose.connection.on("error", (err) => {
          console.error(`MongoDB connection error: ${err}`);
          process.exit(-1);
        });
      }
    );
};

module.exports = InitiateMongoServer;
