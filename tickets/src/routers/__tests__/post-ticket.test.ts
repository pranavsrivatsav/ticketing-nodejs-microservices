import request from "supertest";
import { app } from "../../app";
import { natsWrapper } from "../../events/NatsWrapper";

describe("POST /api/tickets/", () => {
  it("should have a route handler assigned to it", async () => {
    const response = await request(app).post("/api/tickets").send();
    expect(response.statusCode).not.toBe(404);
  });
  it("should throw a 401 if the user is not authenticated", async () => {
    const response = await request(app).post("/api/tickets").send();
    expect(response.statusCode).toBe(401);
  });
  it("should not throw a 401 if the user is authenticated", async () => {
    const cookie = global.getLoginCookie();

    const response = await request(app).post("/api/tickets").set("Cookie", cookie);
    expect(response.statusCode).not.toBe(401);
  });
  it("should throw a 400 if payload is invalid - title and price", async () => {
    const cookie = global.getLoginCookie();

    const response = await request(app).post("/api/tickets").set("Cookie", cookie).send({
      title: "",
      price: 20,
    });

    expect(response.statusCode).toBe(400);

    const response2 = await request(app).post("/api/tickets").set("Cookie", cookie).send({
      title: "Title",
      price: 0,
    });

    expect(response2.statusCode).toBe(400);
  });
  it("should create a ticket if user is authenticated and details are valid", async () => {
    const cookie = global.getLoginCookie();
    const ticket = {
      title: "title",
      price: 20,
    };
    const response = await request(app).post("/api/tickets").set("Cookie", cookie).send(ticket);

    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe(ticket.title);
    expect(response.body.price).toBe(ticket.price);
  });
  it("publishes an event on successful ticket creation", async () => {
    const cookie = global.getLoginCookie();
    const ticket = {
      title: "title",
      price: 20,
    };
    const response = await request(app).post("/api/tickets").set("Cookie", cookie).send(ticket);

    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe(ticket.title);
    expect(response.body.price).toBe(ticket.price);
    expect(natsWrapper.client?.publish).toHaveBeenCalled();
  });
});
