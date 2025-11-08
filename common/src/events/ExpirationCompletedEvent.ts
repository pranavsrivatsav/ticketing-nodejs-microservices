import { Event } from "./Event";
import { Subjects } from "./Subjects";

export interface ExpirationCompletedEvent extends Event {
  subject: Subjects.ExpirationCompleted;
  data: {
    orderId: string;
  };
}
