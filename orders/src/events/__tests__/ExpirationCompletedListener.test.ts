import { ExpirationCompletedEvent, Subjects } from "@psctickets/common/events";
import { natsWrapper } from "../NatsWrapper";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { ExpirationCompletedListener } from "../ExpirationCompletedListener";
import Order from "../../models/Order";
import { OrderStatus } from "../../types/OrderStatus";
import Ticket from "../../models/Ticket";

async function setup() {
  //Get nats client
  const client = natsWrapper.client;

  const ticket = Ticket.buildTicket({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 20,
    title: "title",
    userId: "userid",
    version: 0,
  });

  await ticket.save();

  const order = Order.buildOrder({
    expiresAt: new Date(),
    status: OrderStatus.ACTIVE,
    ticket,
    userId: "userId",
  });

  await order.save();

  //Create sample ticket:created event payload
  const data: ExpirationCompletedEvent["data"] = {
    orderId: order.id,
  };

  // @ts-expect-error create sample msg with mock ack function
  const msg: Message = {
    ack: jest.fn().mockImplementation(() => {
      console.log("message acknowledged");
    }),
  };

  return { client, data, msg };
}

describe("ExpirationCompletedListener", () => {
  it("creates a ticket in db on receiving the message", async () => {
    const { client, data, msg } = await setup();

    await new ExpirationCompletedListener(client).onMsgCallback(data, msg);

    const order = await Order.findById(data.orderId);

    expect(order).not.toBe(null);
    expect(order!.status).toBe(OrderStatus.EXPIRED);
  });

  it("publishes an order:cancelled event", async () => {
    const { client, data, msg } = await setup();

    await new ExpirationCompletedListener(client).onMsgCallback(data, msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();

    const args = (natsWrapper.client.publish as jest.Mock).mock.calls[0];
    expect(args[0]).toBe(Subjects.OrderCancelled);
    expect(JSON.parse(args[1]).id).toBe(data.orderId);
  });

  it("acks the message on processing the message successfully", async () => {
    const { client, data, msg } = await setup();

    await new ExpirationCompletedListener(client).onMsgCallback(data, msg);

    expect(msg.ack).toHaveBeenCalled();
  });
});
