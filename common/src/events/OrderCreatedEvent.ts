import { Subjects } from "./Subjects";

export interface OrderCreatedEvent extends Event {
  subject: Subjects.OrderCreated;
  data: {
    id: string;
    userId: string;
    status: string;
    expiresAt: Date;
    ticketId: string;
  };
}
