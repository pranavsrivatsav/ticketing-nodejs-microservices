import { Subjects } from "./Subjects";

export interface OrderCompletedEvent extends Event {
  subject: Subjects.OrderCompleted;
  data: {
    id: string;
    version: number;
    userId: string;
    ticketId: string;
  };
}

