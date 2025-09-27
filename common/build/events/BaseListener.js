"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseListener = void 0;
class BaseListener {
    constructor(client) {
        this.ackWait = 5 * 1000;
        this.subscriptionOptions = () => this.client
            .subscriptionOptions()
            .setManualAckMode(true)
            .setDeliverAllAvailable()
            .setDurableName(this.queueGroupName)
            .setAckWait(this.ackWait);
        this.parseMsg = (msg) => {
            const data = msg.getData();
            return typeof data === "string"
                ? JSON.parse(data) // for parsing stringified jsons
                : JSON.parse(data.toString("utf-8")); // for parsing buffers
        };
        this.listen = () => {
            const subscription = this.client.subscribe(this.subject, this.queueGroupName, this.subscriptionOptions());
            subscription.on("message", (msg) => {
                console.log(`Message received | Subject: ${msg.getSubject()} | QueueGroup: ${this.queueGroupName} | Sequence: ${msg.getSequence()} `);
                this.onMsgCallback(this.parseMsg(msg), msg);
            });
        };
        this.client = client;
    }
}
exports.BaseListener = BaseListener;
