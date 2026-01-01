// Type for the order response from orders service
// Based on orders/src/models/Order.ts and orders/src/models/Ticket.ts
export interface TicketResponse {
  id: string;
  title: string;
  price: number;
  userId: string;
  version: number;
}

export interface OrderResponse {
  id: string;
  userId: string;
  status: string;
  expiresAt: string;
  ticket: TicketResponse;
  version: number;
}

