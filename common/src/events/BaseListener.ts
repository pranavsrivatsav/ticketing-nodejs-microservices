import { Stan, SubscriptionOptions, Message } from "node-nats-streaming";
import { Event } from "./Event";

export abstract class BaseListener<T extends Event> {
  private client: Stan;

  constructor(client: Stan) {
    this.client = client;
  }

  abstract subject: T["subject"];
  abstract queueGroupName: string;
  abstract onMsgCallback: (data: T["data"], msg: Message) => void;
  protected ackWait = 5 * 1000;
  protected subscriptionOptions: () => SubscriptionOptions = () =>
    this.client
      .subscriptionOptions()
      .setManualAckMode(true)
      .setDeliverAllAvailable()
      .setDurableName(this.queueGroupName)
      .setAckWait(this.ackWait);

  private parseMsg = (msg: Message) => {
    const data = msg.getData();
    return typeof data === "string"
      ? JSON.parse(data) // for parsing stringified jsons
      : JSON.parse(data.toString("utf-8")); // for parsing buffers
  };

  listen = () => {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    );

    subscription.on("message", (msg: Message) => {
      console.log(
        `Message received | Subject: ${msg.getSubject()} | QueueGroup: ${
          this.queueGroupName
        } | Sequence: ${msg.getSequence()} `
      );
      this.onMsgCallback(this.parseMsg(msg), msg);
    });
  };
}
