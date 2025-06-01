import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import { authRouter } from "./routers/authRouter";
import errorMiddleware from "./middlewares/errorMiddleware";
import { NotFoundError } from "./errors/NotFoundError";
import mongoose from "mongoose";
import cookieSession from "cookie-session";

const app = express();

/*
communicate to express that it can trust the proxied connection. Remember how our connection is proxied via ingress nginx, and express might not trust this.
*/
app.set("trust proxy", true);

app.use(json());

app.use(
  cookieSession({
    signed: false, // do not encrypt the contents
    secure: true, // allow cookies transporation only on https connections
  })
);

app.use("/api/users", authRouter);

app.get("/api/users/", (req, res) => {
  res.send("Hello");
});
app.all("*", () => {
  throw new NotFoundError();
});

app.use(errorMiddleware);

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
  checkEnvVariables();
  await connectToMongoDb();
};

app.listen(3000, async () => {
  console.log("listening at 3000");
  await initialize();
});
