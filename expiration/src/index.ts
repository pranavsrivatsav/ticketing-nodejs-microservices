import { natsWrapper } from "./events/NatsWrapper";
import OrderCreatedListener from "./events/OrderCreatedListener";

const envVariableKeys = ["REDIS_HOST", "NATS_CLIENT_ID", "NATS_CLUSTER_ID", "NATS_URL"];
const checkEnvVariables = () => {
  for (const key of envVariableKeys) {
    if (!process.env[key]) {
      throw new Error(`Process env variable with key ${key} is required`);
    }
  }
};

const initializeNatsConnection = async () => {
  await natsWrapper.connect(
    process.env.NATS_CLUSTER_ID!,
    process.env.NATS_CLIENT_ID!,
    process.env.NATS_URL!
  );

  const natsClient = natsWrapper.client;

  new OrderCreatedListener(natsClient).listen();

  natsClient?.on("close", () => {
    console.log("nats connection closed");
    process.exit();
  });
};

const initialize = async () => {
  checkEnvVariables();
  await initializeNatsConnection();
};

initialize()
  .then(() => {
    console.log("Expiration service initialized");
  })
  .catch((err) => console.log("Error while initializing expiration service: " + err));
