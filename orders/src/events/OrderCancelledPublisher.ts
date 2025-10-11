import { BasePublisher, OrderCancelledEvent, Subjects } from "@psctickets/common/events";

export class OrderCancelledPublisher extends BasePublisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
