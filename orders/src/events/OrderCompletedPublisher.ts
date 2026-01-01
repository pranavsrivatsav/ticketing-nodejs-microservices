import { BasePublisher, OrderCompletedEvent, Subjects } from "@psctickets/common/events";

export class OrderCompletedPublisher extends BasePublisher<OrderCompletedEvent> {
  subject: Subjects.OrderCompleted = Subjects.OrderCompleted;
}

