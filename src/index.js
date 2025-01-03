// require("dotenv").config({ path: "./env" });
import dotenv from "dotenv";
import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
  path: "./.env",
});

connectDB()
  .then(() => {
    app.on("error", (err) => {
      console.log("Error", err);
      throw err;
    });

    app.listen(process.env.PORT || 8000),
      () => {
        console.log(`Server is running at port ${process.env.PORT}`);
      };
  })
  .catch((err) => {
    console.log("MongoDB connection failed : ", err);
  });

/*  
************* FIRST APPROACH TO CONNECT DATABASE ***************
By using IFEE and try-catch()

import express from "express";
const app = express();
(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
    app.on("error", (err) => {
      console.log("Error", err);
      throw err;
    });

    app.listen(process.env.PORT, () => {
      console.log(`App is listening on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.log("Error: ", error);
    throw error;
  }
})();
*/
