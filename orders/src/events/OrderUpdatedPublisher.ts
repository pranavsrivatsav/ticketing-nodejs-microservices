import { BasePublisher, OrderUpdatedEvent, Subjects } from "@psctickets/common/events";

export class OrderUpdatedPublisher extends BasePublisher<OrderUpdatedEvent> {
  subject: Subjects.OrderUpdated = Subjects.OrderUpdated;
}
