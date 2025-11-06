import express from "express";
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

router.post("/", verifyTokenMiddleware, createOrderPayloadValidator, createOrderHandler);

router.get("/", verifyTokenMiddleware, getAllOrdersHandler);

router.get("/:orderId", verifyTokenMiddleware, validateOrderIdParam, getOrderByIdHandler);

router.put("/:orderId/cancel", verifyTokenMiddleware, validateOrderIdParam, cancelOrderHandler);

export { router as ordersRouter };
