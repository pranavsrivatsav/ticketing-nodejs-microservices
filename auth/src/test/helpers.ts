import request from "supertest";
import { app } from "../app";

function createTestHelpers() {
  global.validUserData = {
    email: "test@test.com",
    password: "12345true",
  };

  global.getLoginCookie = async () => {
    const response = await request(app).post("/api/users/register").send(global.validUserData);
    return response.get("Set-Cookie") || [];
  };
}

export { createTestHelpers };
