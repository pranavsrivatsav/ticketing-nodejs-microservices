import request from "supertest";
import { app } from "../../app";

describe("POST /api/users/signout", () => {
  it("should sign out user with valid token", async () => {
    const cookie = await global.getLoginCookie();

    const signOutResponse = await request(app).post("/api/users/signout").set("Cookie", cookie);
    expect(signOutResponse.statusCode).toBe(200);
    expect(signOutResponse.headers).toHaveProperty("set-cookie");
    expect(signOutResponse.headers["set-cookie"][0]).toBe(
      "session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly"
    );
  });

  it("should return 401 without token", async () => {
    await request(app).post("/api/users/signout").expect(401);
  });
});
