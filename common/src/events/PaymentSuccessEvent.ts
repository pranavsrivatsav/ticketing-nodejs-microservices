import { Subjects } from "./Subjects";

export interface PaymentSuccessEvent extends Event {
  subject: Subjects.PaymentSuccess;
  data: {
    orderId: string;
    rzpPaymentId: string;
    rzpOrderId: string;
  };
}

