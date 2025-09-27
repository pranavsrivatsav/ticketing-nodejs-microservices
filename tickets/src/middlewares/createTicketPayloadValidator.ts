import { body } from "express-validator";

const createTicketPayloadValidator = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("price").isFloat({ gt: 0 }).withMessage("Price must be greater than 0"),
];

export default createTicketPayloadValidator;
