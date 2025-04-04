import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import { authRouter } from "./routers/authRouter";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import { NotFoundError } from "./errors/NotFoundError";

const app = express();
app.use(json());

app.get("/api/users/", (req, res) => {
  res.send("Hello");
});

app.use("/api/users", authRouter);

app.all("*", () => {
  throw new NotFoundError();
});

app.use(errorMiddleware);

app.listen(3000, () => {
  console.log("listening at 3000");
});
