import { BasePublisher } from "@psctickets/common/events";
import { Subjects } from "@psctickets/common/events";
import { TicketCreatedEvent } from "@psctickets/common/events";

export class TicketCreatedPublisher extends BasePublisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
