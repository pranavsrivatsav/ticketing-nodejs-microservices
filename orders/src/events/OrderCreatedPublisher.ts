import { BasePublisher, OrderCreatedEvent, Subjects } from "@psctickets/common/events";

export class OrderCreatedPublisher extends BasePublisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
