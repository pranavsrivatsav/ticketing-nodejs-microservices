import { OrderCreatedEvent, Subjects } from "@psctickets/common/events";
import Ticket from "../../models/Ticket";
import { natsWrapper } from "../NatsWrapper";
import { Message } from "node-nats-streaming";
import OrderCreatedListener from "../OrderCreatedListener";

async function setup() {
  // create sample nats client
  const natsClient = natsWrapper.client;

  // create sample ticket
  const ticket = await global.createTicket("abc");

  await ticket.save();

  // create sample orderCreated event data
  const data: OrderCreatedEvent["data"] = {
    expiresAt: new Date(),
    id: "orderId",
    status: "Created",
    userId: "sample-user2",
    ticketId: ticket.id,
    version: 1,
  };

  // @ts-expect-error create sample msg with mock ack function
  const msg: Message = {
    ack: jest.fn().mockImplementation(() => {
      console.log("Message acknowledged");
    }),
  };

  // return all
  return { natsClient, ticket, data, msg };
}

describe("OrderCreatedListener", () => {
  it("should set the orderId on the ticket based on the event payload", async () => {
    const { natsClient, ticket, data, msg } = await setup();
    await new OrderCreatedListener(natsClient).onMsgCallback(data, msg);
    const updatedTicket = await Ticket.findById(ticket.id);
    expect(updatedTicket?.orderId).toBe(data.id);
  });

  it("should publish a ticket:updated event", async () => {
    const { natsClient, ticket, data, msg } = await setup();
    await new OrderCreatedListener(natsClient).onMsgCallback(data, msg);

    // verify publish has been called
    expect(natsClient.publish).toHaveBeenCalled();

    // verify the publish event subject and payload
    const args = (natsClient.publish as jest.Mock).mock.calls[0];
    console.log("Publish args", args);

    expect(args[0]).toBe(Subjects.TicketUpdated);

    const eventPayload = JSON.parse(args[1]);
    expect(eventPayload.id).toBe(ticket.id);
    expect(eventPayload.version).toBe(ticket.version + 1);
  });

  it("should acknowledge the message", async () => {
    const { natsClient, data, msg } = await setup();
    await new OrderCreatedListener(natsClient).onMsgCallback(data, msg);

    // verify publish has been called
    expect(msg.ack).toHaveBeenCalled();
  });
});
