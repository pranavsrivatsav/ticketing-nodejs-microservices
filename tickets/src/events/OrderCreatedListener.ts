import { BaseListener, OrderCreatedEvent, Subjects } from "@psctickets/common/events";
import { Message } from "node-nats-streaming";
import Ticket from "../models/Ticket";
import { TicketUpdatedPublisher } from "./TicketUpdatedPublisher";
import EventConstants from "../constants/EventConstants";

class OrderCreatedListener extends BaseListener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = EventConstants.QueueName;
  onMsgCallback: (data: OrderCreatedEvent["data"], msg: Message) => void = (data, msg) => {
    this.OrderCreatedHandler(data).then(() => {
      msg.ack();
    });
  };

  private async OrderCreatedHandler(data: OrderCreatedEvent["data"]) {
    const ticket = await Ticket.findById(data.ticketId);

    if (!ticket) throw new Error("Ticket with id not found");

    if (ticket.orderId) throw new Error("Ticket locked against another order");

    ticket.orderId = data.id;
    await ticket?.save();

    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      version: ticket.version,
    });
  }
}

export default OrderCreatedListener;
