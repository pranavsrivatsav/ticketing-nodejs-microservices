import mongoose from "mongoose";
import { OrderStatus } from "../types/OrderStatus";
import Order from "../models/Order";
import { TicketDocument } from "../models/Ticket";

export function isValidMongoObjectId(id: string) {
  return mongoose.Types.ObjectId.isValid(id);
}

export async function findTaggedOrderForTicket(ticket: TicketDocument) {
  const taggedOrder = await Order.findOne({
    ticket: ticket,
    status: {
      $in: [OrderStatus.ACTIVE, OrderStatus.SUCCESS],
    },
  });

  return taggedOrder;
}
