import { TicketCreatedEvent } from "@psctickets/common/events";
import { natsWrapper } from "../NatsWrapper";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { TicketCreatedListener } from "../TicketCreatedListener";
import Ticket from "../../models/Ticket";

function setup() {
  //Get nats client
  const client = natsWrapper.client;

  //Create sample ticket:created event payload
  const data: TicketCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 20,
    title: "sample title",
    userId: "sample-user",
    version: 1,
  };

  // @ts-expect-error create sample msg with mock ack function
  const msg: Message = {
    ack: jest.fn().mockImplementation(() => {
      console.log("message acknowledged");
    }),
  };

  return { client, data, msg };
}

describe("TicketCreatedListener", () => {
  it("creates a ticket in db on receiving the message", async () => {
    const { client, data, msg } = setup();

    await new TicketCreatedListener(client).onMsgCallback(data, msg);

    const ticket = await Ticket.findById(data.id);

    expect(ticket).not.toBe(null);
    expect(ticket!.title).toBe(data.title);
  });

  it("acks the message on receiving the message successfully", async () => {
    const { client, data, msg } = setup();

    await new TicketCreatedListener(client).onMsgCallback(data, msg);

    expect(msg.ack).toHaveBeenCalled();
  });
});
