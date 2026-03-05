mongoose = require("mongoose");

function connectToDb() {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("connected to DB");
    })
    .catch((err) => {
      console.log("error conntecting to db", err);
    });
}

module.exports = connectToDb;
