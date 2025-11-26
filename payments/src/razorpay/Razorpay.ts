import Razorpay from "razorpay";

export const razorpay = new Razorpay({
  key_id: process.env.RZP_PUBLIC_KEY,
  key_secret: process.env.RZP_PRIVATE_KEY,
});
