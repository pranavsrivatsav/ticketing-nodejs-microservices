import { NotFoundError, UnauthorizedRequest } from "@psctickets/common/errors";
import { CreateOrderPayload } from "../models/CreateOrderPayload";
import Order from "../models/Order";
import { OrderStatus } from "../types/OrderStatus";

export async function createOrder(payload: CreateOrderPayload) {
  const order = Order.buildOrder({
    price: payload.ticket.price,
    expiresAt: getExpiresAt(),
    status: OrderStatus.ACTIVE,
    ticket: payload.ticket,
    userId: payload.userId,
  });

  await order.save();
  return order;
}

export async function getAllOrdersForUser(userId: string) {
  const ordersForUser = await Order.find({
    userId: userId,
  });

  return ordersForUser;
}

export async function getOrderByIdForUser(orderId: string, userId: string) {
  const order = await Order.findOne({
    _id: orderId,
  });

  if (!order) throw new NotFoundError();

  if (order.userId !== userId) throw new UnauthorizedRequest("Unauthorized request");

  return order;
}

export async function cancelOrderForUser(orderId: string, userId: string) {
  const order = await getOrderByIdForUser(orderId, userId);

  order.status = OrderStatus.CANCELLED;
  await order.save();
}

function getExpiresAt() {
  const expirationPeriod = 30 * 60 * 1000; // 30 mins in ms
  return new Date(new Date().getTime() + expirationPeriod);
}
