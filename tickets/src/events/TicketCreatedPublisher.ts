import { BasePublisher, Subjects, TicketCreatedEvent } from "@psctickets/common/events";

export class TicketCreatedPublisher extends BasePublisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
