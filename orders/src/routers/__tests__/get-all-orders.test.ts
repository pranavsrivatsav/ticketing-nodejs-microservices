import request from "supertest";
import { app } from "../../app";

describe("Get all orders - GET orders/", () => {
  it("should throw 401 if the user is not signed in", async () => {
    const response = await request(app).get("/api/orders");

    expect(response.statusCode).toBe(401);
  });

  it("should throw 200 if the user is signed in", async () => {
    const response = await request(app).get("/api/orders").set("Cookie", global.getLoginCookie());

    expect(response.statusCode).toBe(200);
  });

  it("should show only the orders created by the user", async () => {
    const userId = "sample-user";

    const ticket = await global.createTicket("sample-user2");
    const ticket2 = await global.createTicket("sample-user2");

    const order = await global.createOrder(userId, ticket);
    const order2 = await global.createOrder(userId, ticket2);

    const response = await request(app)
      .get("/api/orders")
      .set("Cookie", global.getLoginCookie(userId));

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(2);
    expect([order.id, order2.id]).toContain(response.body[0].id);
  });
});
