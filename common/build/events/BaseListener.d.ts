import { Stan, SubscriptionOptions, Message } from "node-nats-streaming";
import { Event } from "./Event";
export declare abstract class BaseListener<T extends Event> {
    private client;
    constructor(client: Stan);
    abstract subject: T["subject"];
    abstract queueGroupName: string;
    abstract onMsgCallback: (data: T["data"], msg: Message) => void;
    protected ackWait: number;
    protected subscriptionOptions: () => SubscriptionOptions;
    private parseMsg;
    listen: () => void;
}
