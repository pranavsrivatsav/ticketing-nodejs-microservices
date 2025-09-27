import nats from "node-nats-streaming";
import { randomBytes } from "crypto";
import { TicketCreatedListener } from "./events/TicketCreatedListener";

const clientId = randomBytes(4).toString("hex"); //generating a random client id for each listener instance
const stan = nats.connect("ticketing", clientId, {
  url: "http://localhost:4222",
});

// const subscriptionOptions = stan
//   .subscriptionOptions()
//   .setManualAckMode(true)
//   .setDeliverAllAvailable()
//   .setDurableName("durable-sub-name");

// stan.on("connect", () => {
//   console.log("Listener connected to nats streaming client");

//   const subscription = stan.subscribe(
//     "ticket:created",
//     "queueGroupName",
//     subscriptionOptions
//   );

//   subscription.on("message", (msg: Message) => {
//     console.log("message received", msg.getData());
//     msg.ack();
//   });
// });

stan.on("connect", () => {
  console.log("Listener connected to nats streaming client");
  const listener = new TicketCreatedListener(stan);
  listener.listen();
});

stan.on("close", () => {
  console.log("NATS connection closed");
  process.exit();
});

process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());
