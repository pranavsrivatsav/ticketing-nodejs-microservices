import { TicketDocument } from "./Ticket";

export type CreateOrderPayload = {
  ticket: TicketDocument;
  userId: string;
};
