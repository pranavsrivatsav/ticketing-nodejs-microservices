import { Subjects } from "./Subjects";
export interface TicketUpdatedEvent extends Event {
    subject: Subjects.TicketUpdated;
    data: {
        id: string;
        price: number;
        title: string;
        userId: string;
        version: number;
    };
}
