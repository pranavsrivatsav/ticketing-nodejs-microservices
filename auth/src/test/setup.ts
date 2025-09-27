import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { createTestHelpers } from "./helpers";

let mongo: MongoMemoryServer;
beforeAll(async () => {
  //create mongo instance
  mongo = await MongoMemoryServer.create();
  // and connect to it using mongoose
  await mongoose.connect(mongo.getUri());
  //set a jwt key
  process.env.JWT_KEY = "12345";
});

beforeEach(async () => {
  //get all collections and clear them
  const collections = await mongoose.connection.db?.collections();

  collections?.forEach((collection) => {
    collection.deleteMany({});
  });
});

afterAll(async () => {
  //disconnect mongoose and delete mongo instance
  await mongoose.connection.close();
  await mongo.stop();
});

createTestHelpers();
