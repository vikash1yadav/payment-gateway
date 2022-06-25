import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import CONSTANT_DATA from "./src/helper/contant";
import PaymentRouter from "./src/routes/index";
import cors from "cors";
dotenv.config();

const SERVER = () => {
  const app = new express();
  app.use(express.json({ extended: false }));
  app.use(cors());

  const port = process.env.PORT || 5000;

  mongoose.connect(CONSTANT_DATA.MONGO_DB_URL).then(() => {
    console.log('mongodb connected');
  }).catch((error) => {
    console.log(error);
  });

  app.use("/api", PaymentRouter)
  app.listen(port, () =>
    console.log(`server started on http://localhost:${port}`)
  );
  
}
SERVER();