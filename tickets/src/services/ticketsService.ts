import { Request } from "express";
import Ticket from "../models/Ticket";
import { NotFoundError, UnauthorizedRequest } from "@psctickets/common/errors";

export async function createTicket(req: Request) {
  const newTicket = Ticket.buildTicket({
    title: req.body?.title,
    price: req.body?.price,
    userId: req.currentUser!.userId,
  });

  await newTicket.save();

  return newTicket;
}

export async function getTicket(ticketId: string) {
  const ticket = await Ticket.findById(ticketId);

  if (!ticket) {
    throw new NotFoundError();
  }

  return ticket;
}

export async function getAllTickets() {
  const tickets = await Ticket.find({});

  return tickets;
}

export async function updateTicket(req: Request) {
  const userId = req.currentUser?.userId;
  const ticketId = req.params.ticketId;
  const { title, price, version } = req.body;

  //get ticket
  const ticket = await Ticket.findById(ticketId);

  if (!ticket) throw new NotFoundError();

  if (ticket.userId !== userId) throw new UnauthorizedRequest("Invalid Request");

  ticket.title = title;
  ticket.price = price;
  ticket.version = version;

  await ticket.save(); // OCC will be handled - and if provided version is not in sync with the document in DB - then an error will be thrown

  return ticket;
}
