import request from "supertest";
import { app } from "../../app";

describe("POST /api/users/signin", () => {
  beforeEach(async () => {
    await request(app).post("/api/users/register").send(global.validUserData);
  });

  it("should sign in with valid credentials", async () => {
    const response = await request(app).post("/api/users/signin").send(global.validUserData);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("user");
    expect(response.body.user).toHaveProperty("email", global.validUserData.email);
    expect(response.headers).toHaveProperty("set-cookie");
  });

  it("should return 400 with invalid credentials", async () => {
    await request(app)
      .post("/api/users/signin")
      .send({
        email: global.validUserData.email,
        password: "wrongpassword",
      })
      .expect(400);
  });
});
