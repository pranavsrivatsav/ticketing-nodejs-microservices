import { BaseListener, OrderCreatedEvent, Subjects } from "@psctickets/common/events";
import { Message } from "node-nats-streaming";
import EventConstants from "../constants/EventConstants";
import Order, { PgDetails } from "../models/Order";
import { OrderStatus } from "@psctickets/common/orders";
import { createRazorpayOrder } from "../services/razorpayService";
import { PaymentGateways } from "../models/PaymentGateways";

class OrderCreatedListener extends BaseListener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = EventConstants.QueueName;
  onMsgCallback = async (data: OrderCreatedEvent["data"], msg: Message) => {
    const order = Order.buildOrder({
      id: data.id,
      price: data.price,
      status: data.status as OrderStatus,
      userId: data.userId,
    });

    // create razorpay order
    const razorPayOrderDetails = await createRazorpayOrder(order);
    console.log(`razorpayorderid for orderid ${order.id} is ${razorPayOrderDetails.id}`);
    const pgDetails: PgDetails = {
      pgOrderId: razorPayOrderDetails.id,
      pgName: PaymentGateways.RAZORPAY,
    };
    order.set("pgDetails", pgDetails);
    await order.save();

    console.log("Saved order in payments db: " + JSON.stringify(order));

    msg.ack();
  };
}

export default OrderCreatedListener;
