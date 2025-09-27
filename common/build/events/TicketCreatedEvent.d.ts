import { Subjects } from "./Subjects";
export interface TicketCreatedEvent extends Event {
    subject: Subjects.TicketCreated;
    data: {
        id: string;
        price: number;
        title: string;
        userId: string;
    };
}
