import { Message } from "node-nats-streaming";
import { BaseListener } from "@psctickets/common/events";
import { TicketCreatedEvent } from "@psctickets/common/events";
import { Subjects } from "@psctickets/common/events";

export class TicketCreatedListener extends BaseListener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName: string = "queue-asdk";
  protected ackWait: number = 6 * 1000;

  onMsgCallback = (data: TicketCreatedEvent["data"], msg: Message) => {
    console.log(
      `data received for seq ${msg.getSequence()} | id: ${data.id} | price: ${
        data.price
      } | title: ${data.title}`
    );
    msg.ack();
  };
}
