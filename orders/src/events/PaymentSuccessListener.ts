import { BaseListener, PaymentSuccessEvent, Subjects } from "@psctickets/common/events";
import { Message } from "node-nats-streaming";
import EventConstants from "../constants/EventConstants";
import Order from "../models/Order";
import { OrderStatus } from "../types/OrderStatus";
import { OrderCompletedPublisher } from "./OrderCompletedPublisher";

export class PaymentSuccessListener extends BaseListener<PaymentSuccessEvent> {
  subject: Subjects.PaymentSuccess = Subjects.PaymentSuccess;
  queueGroupName: string = EventConstants.QueueName;
  onMsgCallback = async (data: PaymentSuccessEvent["data"], msg: Message) => {
    // Find order based on orderId in data
    const order = await Order.findById(data.orderId);

    if (!order) {
      throw new Error(`Order with id ${data.orderId} does not exist`);
    }

    // Change order status to success
    if (order.status !== OrderStatus.SUCCESS) {
      order.status = OrderStatus.SUCCESS;
      await order.save();
      await order.populate("ticket");
    }

    // Emit OrderCompleted event
    await new OrderCompletedPublisher(this.client).publish({
      id: order.id,
      ticketId: order.ticket.id,
      userId: order.userId,
      version: order.version,
    });

    console.log(`Order ${order.id} status changed to SUCCESS after payment success`);
    msg.ack();
  };
}

