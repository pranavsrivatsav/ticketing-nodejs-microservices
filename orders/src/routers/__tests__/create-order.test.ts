import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { natsWrapper } from "../../events/NatsWrapper";
import { Subjects } from "@psctickets/common/events";

describe("Create New Order - POST orders/", () => {
  it("should return 400 if the request does not have a ticketId", async () => {
    await request(app).post("/api/orders").set("Cookie", global.getLoginCookie("abc")).send({});
  });

  it("should return 400 if the ticketId in the request does not exist", async () => {
    await request(app).post("/api/orders").set("Cookie", global.getLoginCookie("abc")).send({
      ticketId: new mongoose.Types.ObjectId().toHexString(),
    });
  });

  it("should return 400 if the ticketId in the request is already reserved", async () => {
    const ticket = await global.createTicket();

    // create an order with above ticket
    await global.createOrder("abc", ticket);

    // create another order via api call with above ticket
    const response = await request(app)
      .post("/api/orders")
      .set("Cookie", global.getLoginCookie())
      .send({
        ticketId: ticket.id,
      });

    expect(response.statusCode).toBe(400);
  });

  it("should return 201 if the order is successfully created", async () => {
    const ticket = await global.createTicket();

    const response = await request(app)
      .post("/api/orders")
      .set("Cookie", global.getLoginCookie())
      .send({
        ticketId: ticket.id,
      });

    expect(response.statusCode).toBe(201);
  });

  it("should publish order:created event if the order is successfully created", async () => {
    const ticket = await global.createTicket();

    const response = await request(app)
      .post("/api/orders")
      .set("Cookie", global.getLoginCookie())
      .send({
        ticketId: ticket.id,
      });

    expect(natsWrapper.client.publish as jest.Mock).toHaveBeenCalled();

    const args = (natsWrapper.client.publish as jest.Mock).mock.calls[0];
    console.log("response", response.body);

    expect(args[0]).toBe(Subjects.OrderCreated);
    expect(JSON.parse(args[1]).id).toBe(response.body.id);
  });
});
