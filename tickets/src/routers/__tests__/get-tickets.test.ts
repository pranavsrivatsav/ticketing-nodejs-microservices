import request from "supertest";
import { app } from "../../app";

describe("GET /api/tickets/", () => {
  it("should show all the tickets in the db", async () => {
    //create 2 tickets manually
    const ticket1 = await global.createTicket();
    await global.createTicket();
    await global.createTicket();

    //Hit api and check the tickets acquired and the data inside
    const response = await request(app).get("/api/tickets");

    const tickets = response.body?.tickets;
    expect(response.statusCode).toBe(200);
    expect(tickets?.length).toBe(3);
    expect(tickets[0]?.userId).toBe(ticket1.userId);
  });
});
