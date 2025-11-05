import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

describe("Get order by id - GET orders/{id}", () => {
  it("throws 401 if the user is not signed in", async () => {
    const sampleOrderId = new mongoose.Types.ObjectId().toHexString();
    const response = await request(app).get(`/api/orders/${sampleOrderId}`);

    expect(response.statusCode).toBe(401);
  });

  it("throws 404 if the user is trying to access a non existent order", async () => {
    const sampleOrderId = new mongoose.Types.ObjectId().toHexString();
    const response = await request(app)
      .get(`/api/orders/${sampleOrderId}`)
      .set("Cookie", global.getLoginCookie());

    expect(response.statusCode).toBe(404);
  });

  it("throws 401 if the user is trying to access an order created by another user", async () => {
    const sampleUserId = "sample-user";
    const sampleUserId2 = "sample-user2";

    const ticket = await global.createTicket();
    const order = await global.createOrder(sampleUserId, ticket);

    const response = await request(app)
      .get(`/api/orders/${order.id}`)
      .set("Cookie", global.getLoginCookie(sampleUserId2));

    expect(response.statusCode).toBe(401);
  });

  it("throws 200 if the user is trying to access one of the created orders", async () => {
    const sampleUserId = "sample-user";

    const ticket = await global.createTicket();
    const order = await global.createOrder(sampleUserId, ticket);

    const response = await request(app)
      .get(`/api/orders/${order.id}`)
      .set("Cookie", global.getLoginCookie(sampleUserId));

    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBe(order.id);
  });
});
