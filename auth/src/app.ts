import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import { authRouter } from "./routers/authRouter";
import { errorMiddleware } from "@psctickets/common/middlewares";
import { NotFoundError } from "@psctickets/common/errors";
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
    secure: process.env.NODE_ENV !== "test", // only require HTTPS in non-test environments
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

export { app };
