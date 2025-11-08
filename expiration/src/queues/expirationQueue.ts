import { ExpirationCompletedEvent } from "@psctickets/common/events";
import Queue from "bull";
import { ExpirationCompletedPublisher } from "../events/ExpirationCompletedPublisher";
import { natsWrapper } from "../events/NatsWrapper";

export const expirationQueue = new Queue<ExpirationCompletedEvent["data"]>("order:expiration", {
  redis: {
    host: process.env.REDIS_HOST,
    port: 6379,
  },
});

expirationQueue.process(async (job) => {
  console.log("processed job", job.data.orderId);
  await new ExpirationCompletedPublisher(natsWrapper.client).publish({
    orderId: job.data.orderId,
  });
});
