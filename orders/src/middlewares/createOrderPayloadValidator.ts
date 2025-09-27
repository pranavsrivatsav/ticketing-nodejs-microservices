import { body } from "express-validator";

const createOrderPayloadValidator = [
  body("price").isFloat({ gt: 0 }).withMessage("Price must be greater than 0"),
  body("ticketId").isString().notEmpty(),
];

export default createOrderPayloadValidator;
