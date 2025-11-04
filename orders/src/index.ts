import "express-async-errors";
import mongoose from "mongoose";
import { app } from "./app";
import { natsWrapper } from "./events/NatsWrapper";
import { TicketCreatedListener } from "./events/TicketCreatedListener";
import { TicketUpdatedListener } from "./events/TicketUpdatedListener";

const connectToMongoDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("connected to mongodb");
  } catch (error) {
    console.error("Unable to establish connection to db: ", error);
  }
};

const envVariableKeys = ["MONGO_URI", "JWT_KEY", "NATS_CLIENT_ID", "NATS_CLUSTER_ID", "NATS_URL"];
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

  new TicketCreatedListener(natsClient!).listen();
  new TicketUpdatedListener(natsClient!).listen();

  natsClient?.on("close", () => {
    console.log("nats connection closed");
    process.exit();
  });
};

const initialize = async () => {
  checkEnvVariables();
  await initializeNatsConnection();
  await connectToMongoDb();
};

app.listen(3000, async () => {
  console.log("listening at 3000");
  await initialize();
});
