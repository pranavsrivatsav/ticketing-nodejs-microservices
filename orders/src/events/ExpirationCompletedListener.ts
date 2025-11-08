import { BaseListener, ExpirationCompletedEvent, Subjects } from "@psctickets/common/events";
import { Message } from "node-nats-streaming";
import EventConstants from "../constants/EventConstants";
import Order from "../models/Order";
import { OrderStatus } from "../types/OrderStatus";
import { OrderCancelledPublisher } from "./OrderCancelledPublisher";

export class ExpirationCompletedListener extends BaseListener<ExpirationCompletedEvent> {
  subject: Subjects.ExpirationCompleted = Subjects.ExpirationCompleted;
  queueGroupName: string = EventConstants.QueueName;
  onMsgCallback = async (data: ExpirationCompletedEvent["data"], msg: Message) => {
    // find order based on orderId in data
    let order = await Order.findById(data.orderId);

    if (!order) throw new Error(`Order with id ${data.orderId} does not exist`);

    // make status as expired - if order status is not already in SUCCESS or EXPIRED status.
    if (![OrderStatus.SUCCESS, OrderStatus.EXPIRED].includes(order?.status)) {
      order.status = OrderStatus.EXPIRED;
      order = await order.save();
      await order.populate("ticket");
    }

    // publish order:cancelled event
    new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      ticketId: order.ticket.id,
      userId: order.userId,
      version: order.version,
    });

    msg.ack();
  };
}
