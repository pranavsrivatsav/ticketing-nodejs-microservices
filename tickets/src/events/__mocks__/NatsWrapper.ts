export const natsWrapper = {
  client: {
    publish: jest.fn().mockImplementation((subject: string, data: string, callback: () => void) => {
      return new Promise((resolve, _reject) => {
        console.log(`Mock event - ${subject} -  published with data: ` + JSON.stringify(data));
        callback();
        resolve(null);
      });
    }),
  },
};
