import { Subjects } from "./Subjects";
export interface OrderCancelledEvent extends Event {
    subject: Subjects.OrderCancelled;
    data: {
        id: string;
        userId: string;
        status: string;
        expiresAt: Date;
        ticketId: string;
    };
}
