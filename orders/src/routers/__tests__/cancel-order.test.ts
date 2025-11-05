import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { OrderStatus } from "../../types/OrderStatus";
import { natsWrapper } from "../../events/NatsWrapper";
import { Subjects } from "@psctickets/common/events";

describe("Cancel order - PUT orders/:orderId/cancel", () => {
  it("throws 401 if the user is not signed in", async () => {
    const sampleOrderId = new mongoose.Types.ObjectId().toHexString();
    const response = await request(app).put(`/api/orders/${sampleOrderId}/cancel`);

    expect(response.statusCode).toBe(401);
  });

  it("throws 401 if the user is trying to cancel a non-existent order", async () => {
    const sampleOrderId = new mongoose.Types.ObjectId().toHexString();
    const response = await request(app)
      .put(`/api/orders/${sampleOrderId}/cancel`)
      .set("Cookie", global.getLoginCookie());

    expect(response.statusCode).toBe(404);
  });

  it("throws 401 if the user is trying to cancel an order that is created by another user", async () => {
    const sampleuser1 = "sampleuser1";
    const sampleuser2 = "sampleuser2";

    const ticket = await global.createTicket();
    const order = await global.createOrder(sampleuser1, ticket);

    const response = await request(app)
      .put(`/api/orders/${order.id}/cancel`)
      .set("Cookie", global.getLoginCookie(sampleuser2));

    expect(response.statusCode).toBe(401);
  });

  it("throws 200 and changes the status to cancelled if the user is canceling a created order", async () => {
    const user = "sample-user";
    const ticket = await global.createTicket();
    const order = await global.createOrder(user, ticket);

    const response = await request(app)
      .put(`/api/orders/${order.id}/cancel`)
      .set("Cookie", global.getLoginCookie(user));

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe(OrderStatus.CANCELLED); // check order status
    expect(response.body.version).toBe(order.version + 1); // check version update
  });

  it("publishes an order:cancelled event when an order is successfully cancelled", async () => {
    const user = "sample-user";
    const ticket = await global.createTicket();
    const order = await global.createOrder(user, ticket);

    await request(app)
      .put(`/api/orders/${order.id}/cancel`)
      .set("Cookie", global.getLoginCookie(user));

    expect(natsWrapper.client.publish).toHaveBeenCalled();
    const args = (natsWrapper.client.publish as jest.Mock).mock.calls[0];
    console.log("args", args);

    expect(args[0]).toBe(Subjects.OrderCancelled);
    expect(JSON.parse(args[1]).id).toBe(order.id);
  });
});
