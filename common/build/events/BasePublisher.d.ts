import { Stan } from "node-nats-streaming";
import { Event } from "./Event";
export declare abstract class BasePublisher<T extends Event> {
    private client;
    constructor(client: Stan);
    abstract subject: T["subject"];
    publish(data: T["data"]): Promise<void>;
}
