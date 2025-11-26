import { CreateOrderRequest } from "../models/CreateOrderRequest";
import Ticket from "../models/Ticket";
import { BadRequestError, NotFoundError } from "@psctickets/common/errors";
import { OrderStatus } from "../types/OrderStatus";
import {
  cancelOrderForUser,
  createOrder,
  getAllOrdersForUser,
  getOrderByIdForUser,
} from "../services/OrdersService";
import { Request, Response } from "express";
import { findTaggedOrderForTicket, isValidMongoObjectId } from "../utils/HelperFunctions";
import { natsWrapper } from "../events/NatsWrapper";
import { OrderCreatedPublisher } from "../events/OrderCreatedPublisher";
import { OrderCancelledPublisher } from "../events/OrderCancelledPublisher";

export async function createOrderHandler(req: Request, res: Response) {
  const payload: CreateOrderRequest = req.body;

  if (!isValidMongoObjectId(payload.ticketId)) throw new BadRequestError("Invalid request");

  // check if ticket exists
  const ticket = await Ticket.findById(payload.ticketId);
  if (!ticket) throw new NotFoundError("Ticket with provided id does not exist");

  // check if ticket is not reserved - ie find an order that has this ticket
  const taggedOrder = await findTaggedOrderForTicket(ticket);

  if (taggedOrder) {
    if (taggedOrder.status === OrderStatus.ACTIVE)
      throw new BadRequestError("Ticket processing under another order");

    if (taggedOrder.status === OrderStatus.SUCCESS)
      throw new BadRequestError("Ticket already bought");
  }

  // create order
  const order = await createOrder({
    ticket,
    userId: req.currentUser?.userId,
  });

  new OrderCreatedPublisher(natsWrapper.client!).publish({
    expiresAt: order.expiresAt,
    id: order.id,
    status: order.status,
    ticketId: order.ticket.id,
    userId: order.userId,
    version: order.version,
    price: order.ticket.price,
  });

  res.status(201).send(order);
}

export async function getAllOrdersHandler(req: Request, res: Response) {
  const orders = await getAllOrdersForUser(req.currentUser?.userId);
  res.status(200).send(orders);
}

export async function getOrderByIdHandler(req: Request, res: Response) {
  const order = await getOrderByIdForUser(req.params.orderId, req.currentUser?.userId);

  res.status(200).send(order);
}

export async function cancelOrderHandler(req: Request, res: Response) {
  const order = await cancelOrderForUser(req.params.orderId, req.currentUser?.userId);

  new OrderCancelledPublisher(natsWrapper.client!).publish({
    id: order.id,
    ticketId: order.ticket.id,
    userId: order.userId,
    version: order.version,
  });

  res.status(200).send(order);
}
