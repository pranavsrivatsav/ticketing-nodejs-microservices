import nats, { Stan } from "node-nats-streaming";
class NatsWrapper {
  //mark _client as optional property using ? because it will not be initialized until connect is called.
  private _client?: Stan;

  get client() {
    return this._client;
  }

  connect(clusterId: string, clientId: string, url: string) {
    this._client = nats.connect(clusterId, clientId, {
      url: url,
    });
  }
}

const natsWrapper = new NatsWrapper();
export { natsWrapper };
