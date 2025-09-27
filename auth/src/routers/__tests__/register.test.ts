import request from "supertest";
import { app } from "../../app";

describe("POST /api/users/register", () => {
  it("should create a new user with valid input", async () => {
    const response = await request(app)
      .post("/api/users/register")
      .send(global.validUserData)
      .expect(201);

    expect(response.headers).toHaveProperty("set-cookie");
  });

  it("should return 400 with invalid email", async () => {
    const response = await request(app)
      .post("/api/users/register")
      .send({
        email: "invalid-email",
        password: "123",
      })
      .expect(400);

    expect(response.body[0].field).toBe("email");
  });

  it("should return 400 with invalid password", async () => {
    const response = await request(app)
      .post("/api/users/register")
      .send({
        email: "email@email.com",
        password: "123",
      })
      .expect(400);

    expect(response.body[0].field).toBe("password");
  });

  it("should return 400 if email already exists", async () => {
    await global.getLoginCookie();
    await request(app).post("/api/users/register").send(global.validUserData).expect(400);
  });
});
