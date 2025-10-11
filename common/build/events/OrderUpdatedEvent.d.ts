import { Subjects } from "./Subjects";
export interface OrderUpdatedEvent extends Event {
    subject: Subjects.OrderUpdated;
    data: {
        id: string;
        userId: string;
        status: string;
        expiresAt: Date;
        ticketId: string;
    };
}
