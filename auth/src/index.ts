import "express-async-errors";
import mongoose from "mongoose";
import { app } from "./app";

const connectToMongoDb = async () => {
  try {
    await mongoose.connect("mongodb://auth-mongodb-svc:27017/auth");
    console.log("connected to mongodb");
  } catch (error) {
    console.error("Unable to establish connection to db: ", error);
  }
};

const checkEnvVariables = () => {
  if (!process.env.JWT_KEY) throw new Error("env variable JWT_KEY not available");
};

const initialize = async () => {
  console.log("initializing auth service..");
  checkEnvVariables();
  await connectToMongoDb();
};

app.listen(3000, async () => {
  console.log("listening at 3000");
  await initialize();
});
