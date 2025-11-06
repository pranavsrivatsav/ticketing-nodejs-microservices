import nats, { Stan } from "node-nats-streaming";
class NatsWrapper {
  //mark _client as optional property using ? because it will not be initialized until connect is called.
  private _client?: Stan;

  get client() {
    if (!this._client) {
      throw new Error("Cannot access NATS client before connecting.");
    }
    return this._client;
  }

  connect(clusterId: string, clientId: string, url: string) {
    this._client = nats.connect(clusterId, clientId, {
      url: url,
    });

    //We return a promise - making the connect function an async function
    //Which resolves either once the client is successfully connected
    //And rejects when there is an error while connecting
    return new Promise<void>((resolve, reject) => {
      this.client.on("connect", () => {
        console.log("Connected to NATS");
        resolve();
      });

      this.client.on("error", (err) => {
        reject(err);
      });
    });
  }
}

const natsWrapper = new NatsWrapper();
export { natsWrapper };
