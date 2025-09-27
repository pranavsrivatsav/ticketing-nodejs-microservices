import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { RequestValidationError } from "@psctickets/common/errors";
import { createTicket, getAllTickets, getTicket, updateTicket } from "../services/ticketsService";
import { natsWrapper } from "../events/NatsWrapper";
import { TicketCreatedPublisher } from "../events/TicketCreatedPublisher";
import { TicketUpdatedPublisher } from "../events/TicketUpdatedPublisher";

// Create a new ticket
export const createTicketHandler = async (req: Request, res: Response) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    throw new RequestValidationError(result.array());
  }

  const ticket = await createTicket(req);

  await new TicketCreatedPublisher(natsWrapper.client!).publish({
    id: ticket.id,
    price: ticket.price,
    title: ticket.title,
  });

  res.send(ticket);
};

//get details of a ticket
export const getTicketHandler = async (req: Request, res: Response) => {
  const ticketId = req.params.ticketId;

  const ticketDetails = await getTicket(ticketId);
  res.send(ticketDetails);
};

//get all tickets
export const getAllTicketsHandler = async (req: Request, res: Response) => {
  const tickets = await getAllTickets();

  res.send({ tickets });
};

//update ticket
export const updateTicketHandler = async (req: Request, res: Response) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    throw new RequestValidationError(result.array());
  }

  const updatedTicket = await updateTicket(req);

  await new TicketUpdatedPublisher(natsWrapper.client!).publish({
    id: updatedTicket.id,
    title: updatedTicket.title,
    price: updatedTicket.price,
  });

  res.send(updatedTicket);
};
