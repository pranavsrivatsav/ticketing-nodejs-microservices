import { BaseListener, OrderCancelledEvent, Subjects } from "@psctickets/common/events";
import EventConstants from "../constants/EventConstants";
import { Message } from "node-nats-streaming";
import Ticket from "../models/Ticket";
import { TicketUpdatedPublisher } from "./TicketUpdatedPublisher";

class OrderCancelledListener extends BaseListener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = EventConstants.QueueName;
  onMsgCallback: (data: OrderCancelledEvent["data"], msg: Message) => void = (data, msg) => {
    this.OrderCancelledHandler(data).then(() => {
      msg.ack();
    });
  };

  private async OrderCancelledHandler(data: OrderCancelledEvent["data"]) {
    const ticket = await Ticket.findById(data.ticketId);

    if (!ticket) throw new Error("Ticket with id not found");

    if (ticket.orderId && ticket.orderId !== data.id) {
      throw new Error("Ticket locked against another order");
    }

    ticket.orderId = undefined;
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

export default OrderCancelledListener;
