import { BasePublisher, ExpirationCompletedEvent, Subjects } from "@psctickets/common/events";

export class ExpirationCompletedPublisher extends BasePublisher<ExpirationCompletedEvent> {
  subject: Subjects.ExpirationCompleted = Subjects.ExpirationCompleted;
}
