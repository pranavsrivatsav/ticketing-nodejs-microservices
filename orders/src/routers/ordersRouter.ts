import express, { Request, Response } from "express";
import Ticket from "../models/Ticket";
import Order from "../models/Order";
import { OrderStatus } from "../types/OrderStatus";
import mongoose from "mongoose";
import createOrderPayloadValidator from "../middlewares/createOrderPayloadValidator";
import { verifyTokenMiddleware } from "@psctickets/common/middlewares";
import {
  cancelOrderHandler,
  createOrderHandler,
  getAllOrdersHandler,
  getOrderByIdHandler,
} from "../controllers/ordersController";
import { validateOrderIdParam } from "../middlewares/validateOrderIdParam";

const router = express.Router();

router.post("/hello", async (req: Request, res: Response) => {
  const ticket = Ticket.buildTicket({
    price: 10,
    title: "title",
    userId: new mongoose.Types.ObjectId().toHexString(),
  });

  await ticket.save();

  const expirationPeriodInMs = 30 * 60 * 1000;

  const order = Order.buildOrder({
    expiresAt: new Date(new Date().getTime() + expirationPeriodInMs),
    price: ticket.price,
    status: OrderStatus.CANCELLED,
    ticket: ticket,
    userId: new mongoose.Types.ObjectId().toHexString(),
  });
  res.send(order);
});

router.post("/", verifyTokenMiddleware, createOrderPayloadValidator, createOrderHandler);

router.get("/", verifyTokenMiddleware, getAllOrdersHandler);

router.get("/:orderId", verifyTokenMiddleware, validateOrderIdParam, getOrderByIdHandler);

router.put("/:orderId/cancel", verifyTokenMiddleware, validateOrderIdParam, cancelOrderHandler);

export { router as ordersRouter };
