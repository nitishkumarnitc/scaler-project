const mongoose = require("mongoose");
require("dotenv").config();
require("colors");
const uri = process.env.DB;

const dbConnect = async () => {
  await mongoose
    .connect(uri)
    .then(() => {
      console.log("Database connected! ".yellow.bold);
    })
    .catch((err) => {
      console.error(`Failed to connect database: ${err}`.red.bold);
    });
};
dbConnect();
