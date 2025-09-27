import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

describe("GET /api/tickest/{ticketId}", () => {
  //Status code 404 if ticket id  does not exist
  it("should throw 404 if a ticket with provided ticket id does not exist", async () => {
    //create random ticket id
    const randomId = new mongoose.Types.ObjectId().toHexString();

    //make the get request with the ticket id
    const response = await request(app).get(`/api/tickets/${randomId}`);

    expect(response.statusCode).toBe(404);
  });

  //Status code 200 if ticket exists and show ticket details
  it("should throw 200 status code with ticket details in the response body if ticket exists", async () => {
    //create a new ticket using the ticket model
    const newTicket = await global.createTicket();

    //use that ticket id to make the request
    const response = await request(app).get(`/api/tickets/${newTicket.id}`);
    expect(response.statusCode).toBe(200);
    expect(response.body?.price).toBe(newTicket.price);
    expect(response?.body.title).toBe(newTicket.title);
    expect(response?.body?.userId).toBe(newTicket.userId);
  });
});
