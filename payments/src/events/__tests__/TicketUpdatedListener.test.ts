import { TicketCreatedEvent } from "@psctickets/common/events";
import { natsWrapper } from "../NatsWrapper";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import Ticket from "../../models/Ticket";
import { TicketUpdatedListener } from "../TicketUpdatedListener";

async function setup() {
  //Get nats client
  const client = natsWrapper.client;

  // create sample ticket and save it to db
  const ticket = Ticket.buildTicket({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 20,
    title: "sample-title",
    userId: "sampleuser",
    version: 0,
  });

  await ticket.save();

  console.log("saved ticket", ticket);

  //Create sample ticket:updated event payload based on the above created ticket
  const data: TicketCreatedEvent["data"] = {
    id: ticket.id,
    price: 40,
    title: "sample-title2",
    userId: "sampleuser",
    version: 1,
  };

  // @ts-expect-error create sample msg with mock ack function
  const msg: Message = {
    ack: jest.fn().mockImplementation(() => {
      console.log("message acknowledged");
    }),
  };

  return { client, ticket, data, msg };
}

describe("TicketUpdatedListener", () => {
  it("updates a ticket in db on receiving the message", async () => {
    const { client, data, msg } = await setup();

    await new TicketUpdatedListener(client).onMsgCallback(data, msg);

    const updatedTicket = await Ticket.findById(data.id);

    expect(updatedTicket).not.toBe(null);
    expect(updatedTicket!.title).toBe(data.title);
    expect(updatedTicket!.version).toBe(data.version);
  });

  it("acks the message on receiving the message successfully", async () => {
    const { client, data, msg } = await setup();

    await new TicketUpdatedListener(client).onMsgCallback(data, msg);

    expect(msg.ack).toHaveBeenCalled();
  });

  it("throws an error when the version of the ticket in the message is out of sync", async () => {
    const { client, data, msg } = await setup();

    // make version out of sync
    data.version += 1;

    const updateFn = async () => await new TicketUpdatedListener(client).onMsgCallback(data, msg);

    await expect(updateFn()).rejects.toThrow();
  });
});
