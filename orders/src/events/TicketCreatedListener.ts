import { BaseListener, Subjects, TicketCreatedEvent } from "@psctickets/common/events";
import { Message } from "node-nats-streaming";
import Ticket from "../models/Ticket";
import EventConstants from "../constants/EventConstants";

export class TicketCreatedListener extends BaseListener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName: string = EventConstants.QueueName;
  onMsgCallback = (
    data: { id: string; price: number; title: string; userId: string },
    msg: Message
  ) => {
    const ticket = Ticket.buildTicket({
      id: data.id,
      price: data.price,
      title: data.title,
      userId: data.userId,
    });

    ticket
      .save()
      .then(() => {
        console.log("Ticket created based on listened event - " + JSON.stringify(data));
        msg.ack();
      })
      .catch((err) => console.log(err));
  };
}
