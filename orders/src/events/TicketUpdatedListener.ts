import { BaseListener, Subjects, TicketUpdatedEvent } from "@psctickets/common/events";
import { Message } from "node-nats-streaming";
import Ticket from "../models/Ticket";
import EventConstants from "../constants/EventConstants";
import { NotFoundError } from "@psctickets/common/errors";

export class TicketUpdatedListener extends BaseListener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName: string = EventConstants.QueueName;
  onMsgCallback = async (data: TicketUpdatedEvent["data"], msg: Message) => {
    const ticket = await Ticket.findOneWithVersion(data.id, data.version - 1);

    if (!ticket)
      throw new NotFoundError(
        `Ticket with id and version in the incoming event does not exist - ${data.id} version ${data.version - 1}`
      );

    ticket.price = data.price;
    ticket.title = data.title;
    ticket.userId = data.userId;
    await ticket.save();
    console.log("Ticket updated based on listened event - " + JSON.stringify(data));
    msg.ack();
  };
}
