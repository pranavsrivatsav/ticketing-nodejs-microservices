import { NotFoundError, UnauthorizedRequest } from "@psctickets/common/errors";
import { CreateOrderPayload } from "../models/CreateOrderPayload";
import Order from "../models/Order";
import { OrderStatus } from "../types/OrderStatus";

export async function createOrder(payload: CreateOrderPayload) {
  const order = Order.buildOrder({
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

  const populatedOrders = ordersForUser.map(async (order) => order.populate("ticket"));

  return await Promise.all(populatedOrders);
}

export async function getOrderByIdForUser(orderId: string, userId: string) {
  const order = await Order.findOne({
    _id: orderId,
  });

  if (!order) throw new NotFoundError("Order with provided id does not exist");

  if (order.userId !== userId) throw new UnauthorizedRequest("Unauthorized request");

  return await order.populate("ticket");
}

export async function cancelOrderForUser(orderId: string, userId: string) {
  const order = await getOrderByIdForUser(orderId, userId);

  order.status = OrderStatus.CANCELLED;
  await order.save();
  return order;
}

export function getExpiresAt() {
  const expirationPeriod = 0.5 * 60 * 60 * 1000; // 30 mins in ms
  return new Date(new Date().getTime() + expirationPeriod);
}
