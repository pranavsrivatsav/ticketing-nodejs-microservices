import { BaseListener, OrderCreatedEvent, Subjects } from "@psctickets/common/events";
import { Message } from "node-nats-streaming";
import Ticket from "../models/Ticket";
import { TicketUpdatedPublisher } from "./TicketUpdatedPublisher";
import EventConstants from "../constants/EventConstants";

class OrderCreatedListener extends BaseListener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = EventConstants.QueueName;
  onMsgCallback = async (data: OrderCreatedEvent["data"], msg: Message) => {
    const ticket = await Ticket.findById(data.ticketId);

    if (!ticket) throw new Error("Ticket with id not found");

    if (ticket.orderId) throw new Error("Ticket locked against another order");

    ticket.orderId = data.id;
    await ticket?.save();

    console.log("inside listener end ticket: ", ticket);

    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      version: ticket.version,
    });

    msg.ack();
  };
}

export default OrderCreatedListener;
