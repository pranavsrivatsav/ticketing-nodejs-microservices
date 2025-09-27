import { randomBytes } from "crypto";
import nats from "node-nats-streaming";
import { TicketCreatedPublisher } from "./events/TicketCreatedPublisher";
import { TicketCreatedEvent } from "@psctickets/common/events";

const stan = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222",
});

stan.on("connect", async () => {
  const dataId = randomBytes(3).toString("hex");
  const data: TicketCreatedEvent["data"] = {
    id: dataId,
    title: "title",
    price: 10,
  };

  // stan.publish("ticket:created", JSON.stringify(data), () => {
  //   console.log("Event published", dataId);
  // });

  const publisher = new TicketCreatedPublisher(stan);
  try {
    await publisher.publish(data);
    console.log(`Ticket with id ${data.id} published successfully`);
  } catch (err) {
    console.error(`Unable to publish ticket with id ${data.id}: `, err);
  }
});
