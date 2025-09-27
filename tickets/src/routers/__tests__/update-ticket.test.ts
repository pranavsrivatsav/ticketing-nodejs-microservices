import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { natsWrapper } from "../../events/NatsWrapper";

describe("PUT /api/tickets/{ticketId}", () => {
  //throw 404 if the ticket does not exist
  it("should return 404 status code if the ticket with id does not exist", async () => {
    const randomId = new mongoose.Types.ObjectId().toHexString();

    request(app).put(`/api/tickets/${randomId}`).expect(404);
  });

  //throw 401 if the user is not authenticated
  it("should return 401 if the user is not authenticated", async () => {
    const newTicket = await global.createTicket();

    request(app).put(`api/tickets/${newTicket.id}`).expect(401);
  });

  //throw 401 if the authenticated user is not the ticket owner and not throw 401 if the user is the owner
  it("should throw 401 if the user is not the owner of the ticket", async () => {
    const nonOwnerId = "abc";
    const ownerId = "def";

    const cookie = global.getLoginCookie(nonOwnerId);
    const ownerCookie = global.getLoginCookie(ownerId);
    const newTicket = await global.createTicket(ownerId);

    //Non owner update request - expect 401
    await request(app)
      .put(`/api/tickets/${newTicket.id}`)
      .set("Cookie", cookie)
      .send({
        title: "title",
        price: 10,
      })
      .expect(401);

    //Owner update request - do not expect 401
    const response1 = await request(app)
      .put(`/api/tickets/${newTicket.id}`)
      .set("Cookie", ownerCookie)
      .send({
        title: "title",
        price: 10,
      });
    expect(response1.statusCode).not.toBe(401);
  });

  //throw 400 if the payload is not valid
  it("should throw 400 if the payload is not valid", async () => {
    const ownerId = "abc";
    const newTicket = await global.createTicket(ownerId);
    const cookie = global.getLoginCookie(ownerId);

    // invalid title
    await request(app)
      .put(`/api/tickets/${newTicket.id}`)
      .set("Cookie", cookie)
      .send({
        title: "",
        price: 10,
      })
      .expect(400);

    // invalid price
    await request(app)
      .put(`/api/tickets/${newTicket.id}`)
      .set("Cookie", cookie)
      .send({
        title: "abcd",
        price: 0,
      })
      .expect(400);
  });

  //expect 200 if the payload is valid and verify updation
  it("should return 200 status and updated ticket if the payload is valid", async () => {
    const ownerId = "abc";
    const newTicket = await global.createTicket(ownerId);
    const cookie = global.getLoginCookie(ownerId);

    const ticketPayload = {
      title: "abcd",
      price: 10,
    };

    const response = await request(app)
      .put(`/api/tickets/${newTicket.id}`)
      .set("Cookie", cookie)
      .send(ticketPayload);

    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe(ticketPayload.title);
    expect(response.body.price).toBe(ticketPayload.price);
  });

  //expect 200 if the payload is valid and verify updation
  it("publishes an event on successful ticket updation", async () => {
    const ownerId = "abc";
    const newTicket = await global.createTicket(ownerId);
    const cookie = global.getLoginCookie(ownerId);

    const ticketPayload = {
      title: "abcd",
      price: 10,
    };

    const response = await request(app)
      .put(`/api/tickets/${newTicket.id}`)
      .set("Cookie", cookie)
      .send(ticketPayload);

    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe(ticketPayload.title);
    expect(response.body.price).toBe(ticketPayload.price);
    expect(natsWrapper.client?.publish).toHaveBeenCalled();
  });
});
