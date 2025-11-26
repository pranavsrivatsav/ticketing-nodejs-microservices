import { BaseListener, OrderCancelledEvent, Subjects } from "@psctickets/common/events";
import EventConstants from "../constants/EventConstants";
import { Message } from "node-nats-streaming";
import Order from "../models/Order";
import { OrderStatus } from "@psctickets/common/orders";

class OrderCancelledListener extends BaseListener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = EventConstants.QueueName;
  onMsgCallback = async (data: OrderCancelledEvent["data"], msg: Message) => {
    const order = await Order.findById(data.id);

    if (!order) {
      throw new Error(`Order with ${data.id} not found`);
    }

    order!.status = OrderStatus.CANCELLED;

    console.log(`Order with status ${order.id} has been cancelled`);

    msg.ack();
  };
}

export default OrderCancelledListener;
