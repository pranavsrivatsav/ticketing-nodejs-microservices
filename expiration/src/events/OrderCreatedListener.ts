import { BaseListener, OrderCreatedEvent, Subjects } from "@psctickets/common/events";
import { Message } from "node-nats-streaming";
import EventConstants from "../constants/EventConstants";
import { expirationQueue } from "../queues/expirationQueue";
import { ExpirationCompletedPublisher } from "./ExpirationCompletedPublisher";

class OrderCreatedListener extends BaseListener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = EventConstants.QueueName;
  onMsgCallback = async (data: OrderCreatedEvent["data"], msg: Message) => {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    console.log(`Adding to queue with a delay of ${delay} ms`);
    //Note: If the Queue has issues establishing connection with redis, this promise will never get
    //resolved, and the execution will not go over this step, so the msg will not be acknowledeged -
    //and the message will keep getting received again and again - so make sure the redis connection
    //is established and the Queue is created

    await expirationQueue.add(
      {
        orderId: data.id,
      },
      {
        delay,
      }
    );

    msg.ack();
  };
}

export default OrderCreatedListener;
