import { verifyTokenMiddleware } from "@psctickets/common/middlewares";
import express from "express";
import {
  createTicketHandler,
  getAllTicketsHandler,
  getTicketHandler,
  updateTicketHandler,
} from "../controllers/ticketsController";
import createTicketPayloadValidator from "../middlewares/createTicketPayloadValidator";
import updateTicketPayloadValidator from "../middlewares/updateTicketPayloadValidator";

const router = express.Router();

router.post("/", verifyTokenMiddleware, createTicketPayloadValidator, createTicketHandler);
router.get("/:ticketId", getTicketHandler);
router.get("/", getAllTicketsHandler);
router.put("/:ticketId", verifyTokenMiddleware, updateTicketPayloadValidator, updateTicketHandler);

export { router as ticketsRouter };
