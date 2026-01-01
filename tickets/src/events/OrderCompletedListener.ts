import { BaseListener, OrderCompletedEvent, Subjects } from "@psctickets/common/events";
import EventConstants from "../constants/EventConstants";
import { Message } from "node-nats-streaming";
import Ticket from "../models/Ticket";
import { TicketUpdatedPublisher } from "./TicketUpdatedPublisher";

class OrderCompletedListener extends BaseListener<OrderCompletedEvent> {
  subject: Subjects.OrderCompleted = Subjects.OrderCompleted;
  queueGroupName = EventConstants.QueueName;
  onMsgCallback = async (data: OrderCompletedEvent["data"], msg: Message) => {
    // Find tickets tagged to the order id in the incoming event payload
    const tickets = await Ticket.find({ orderId: data.id });

    if (tickets && tickets.length > 0) {
      // Update purchased status to true for all tickets associated with this order
      for (const ticket of tickets) {
        if (!ticket.purchased) {
          ticket.purchased = true;
          await ticket.save();

          // Publish ticket updated event to keep other services in sync
          await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            price: ticket.price,
            title: ticket.title,
            userId: ticket.userId,
            version: ticket.version,
          });

          console.log(`Ticket ${ticket.id} marked as purchased for order ${data.id}`);
        }
      }
    }

    console.log(`OrderCompleted event received for orderId: ${data.id}`);

    msg.ack();
  };
}
export default OrderCompletedListener;
