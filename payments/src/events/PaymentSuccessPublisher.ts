import { BasePublisher, PaymentSuccessEvent, Subjects } from "@psctickets/common/events";

export class PaymentSuccessPublisher extends BasePublisher<PaymentSuccessEvent> {
  subject: Subjects.PaymentSuccess = Subjects.PaymentSuccess;
}

