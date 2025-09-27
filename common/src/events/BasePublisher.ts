import { Stan } from "node-nats-streaming";
import { Event } from "./Event";

export abstract class BasePublisher<T extends Event> {
  private client: Stan;
  constructor(client: Stan) {
    this.client = client;
  }

  abstract subject: T["subject"];

  async publish(data: T["data"]): Promise<void> {
    return new Promise((resolve, reject) => {
      //in case of publish failure - nats client will send that error in the err parameter in the callback
      this.client.publish(this.subject, JSON.stringify(data), (err) => {
        //in case of err - reject
        if (err) reject(err);

        //else console and resolve
        console.log(
          `Event published - (${this.subject}): `,
          JSON.stringify(data)
        );
        resolve();
      });
    });
  }
}
