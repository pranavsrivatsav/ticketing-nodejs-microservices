import { Subjects } from "./Subjects";

export interface OrderCancelledEvent extends Event {
  subject: Subjects.OrderCancelled;
  data: {
    id: string;
    version: number;
    userId: string;
    ticketId: string;
  };
}
