import { BaseListener, Subjects, TicketCreatedEvent } from "@psctickets/common/events";
import { Message } from "node-nats-streaming";
import Ticket from "../models/Ticket";
import EventConstants from "../constants/EventConstants";

export class TicketCreatedListener extends BaseListener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName: string = EventConstants.QueueName;
  onMsgCallback = async (data: TicketCreatedEvent["data"], msg: Message) => {
    const ticket = Ticket.buildTicket({
      id: data.id,
      price: data.price,
      title: data.title,
      userId: data.userId,
      version: data.version,
    });

    await ticket.save();
    console.log("Ticket created based on listened event - " + JSON.stringify(data));
    msg.ack();
  };
}
