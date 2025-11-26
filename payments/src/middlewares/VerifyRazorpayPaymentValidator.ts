import { body } from "express-validator";

const VerifyRazorpayPaymentValidator = [
  body("rzpPaymentId").isString().notEmpty(),
  body("rzpOrderId").isString().notEmpty(),
  body("rzpSignature").isString().notEmpty(),
];

export default VerifyRazorpayPaymentValidator;
