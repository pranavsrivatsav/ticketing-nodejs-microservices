import { BaseListener, OrderCompletedEvent, Subjects } from "@psctickets/common/events";
import EventConstants from "../constants/EventConstants";
import { Message } from "node-nats-streaming";
import Order from "../models/Order";
import { OrderStatus } from "@psctickets/common/orders";

class OrderCompletedListener extends BaseListener<OrderCompletedEvent> {
  subject: Subjects.OrderCompleted = Subjects.OrderCompleted;
  queueGroupName = EventConstants.QueueName;
  onMsgCallback = async (data: OrderCompletedEvent["data"], msg: Message) => {
    const order = await Order.findById(data.id);

    if (!order) {
      throw new Error(`Order with id ${data.id} not found`);
    }

    // Update order status to SUCCESS to stay in sync
    order.status = OrderStatus.SUCCESS;
    await order.save();

    console.log(`Order ${order.id} status updated to SUCCESS in payments service`);

    msg.ack();
  };
}

export default OrderCompletedListener;
