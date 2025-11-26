import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { createTestHelpers } from "./helpers";

let mongo: MongoMemoryServer;

jest.mock("../events/NatsWrapper"); // provide the relative path of the file to be replaced with mock
// the mock file should be in the __mocks__ folder under the same directory as the mocked file - here the
//__mocks__ folder should be present in the same folder as NatsWrapper i.e events folder

beforeAll(async () => {
  process.env.JWT_KEY = "123456";
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

  // clear mock calls history
  jest.clearAllMocks();
});

afterAll(async () => {
  //disconnect mongoose and delete mongo instance
  await mongoose.connection.close();
  await mongo.stop();
});

createTestHelpers();
