import { BasePublisher, Subjects, TicketUpdatedEvent } from "@psctickets/common/events";

export class TicketUpdatedPublisher extends BasePublisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
