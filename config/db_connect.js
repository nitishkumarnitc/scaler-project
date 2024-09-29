const mongoose = require("mongoose");
require("dotenv").config();
require("colors");
const uri = process.env.DB;

const db_connect = async () => {
  await mongoose
    .connect(uri)
    .then(() => {
      console.log("Database connected! ".yellow.bold);
    })
    .catch((err) => {
      console.error(`Failed to connect database: ${err}`.red.bold);
    });
};
db_connect();
