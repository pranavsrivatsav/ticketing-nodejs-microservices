import express from "express";
import { json } from "body-parser";

const app = express();
app.use(json());

app.get("/api/users/", (req, res) => {
  res.send("Hello");
});

app.listen(3000, () => {
  console.log("listening at 3000");
});
