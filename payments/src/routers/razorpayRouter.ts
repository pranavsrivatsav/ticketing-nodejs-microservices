import express, { Request, Response } from "express";
import { verifyTokenMiddleware } from "@psctickets/common/middlewares";
import VerifyRazorpayPaymentValidator from "../middlewares/VerifyRazorpayPaymentValidator";
import { getPgDetailsHandler, verifyPaymentHandler } from "../controllers/razorpayController";

const router = express.Router();

router.post("/hello", (req: Request, res: Response) => {
  res.send("hello");
});

router.get("/:orderId/pgDetails", verifyTokenMiddleware, getPgDetailsHandler);

router.post(
  "/:orderId/verify",
  verifyTokenMiddleware,
  VerifyRazorpayPaymentValidator,
  verifyPaymentHandler
);

export { router as razorpayRouter };
