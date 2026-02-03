require("dotenv").config();

const app = require("./src/app");
const mongoose = require("mongoose");
const connectToDb = require("./src/config/database");

connectToDb();

app.listen(3000, () => {
  console.log("server is running at port 3000");
});
