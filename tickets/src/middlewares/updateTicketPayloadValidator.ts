import { body } from "express-validator";

const updateTicketPayloadValidator = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("price").isFloat({ gt: 0 }).withMessage("Price must be greater than 0"),
  body("version").isNumeric(),
];

export default updateTicketPayloadValidator;
