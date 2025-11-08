jest.mock("../events/NatsWrapper"); // provide the relative path of the file to be replaced with mock
// the mock file should be in the __mocks__ folder under the same directory as the mocked file - here the
//__mocks__ folder should be present in the same folder as NatsWrapper i.e events folder

beforeEach(async () => {
  // clear mock calls history
  jest.clearAllMocks();
});
