import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import { errorMiddleware } from "@psctickets/common/middlewares";
import { NotFoundError } from "@psctickets/common/errors";
import cookieSession from "cookie-session";
import { ordersRouter } from "./routers/ordersRouter";

const app = express();

/*
communicate to express that it can trust the proxied connection. Remember how our connection is proxied via ingress nginx, and express might not trust this.
*/
app.set("trust proxy", true);

app.use(json());

app.use(
  cookieSession({
    signed: false, // do not encrypt the contents
    secure: false, // we will re-enable it to true once we have https certification for our domain
  })
);

app.use("/api/orders", ordersRouter);

app.all("*", () => {
  console.log("Reached all");
  throw new NotFoundError();
});

app.use(errorMiddleware);

export { app };
