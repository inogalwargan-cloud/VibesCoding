import { describe, expect, it, spyOn } from "bun:test";
import { app } from "./index";
import * as usersService from "./services/users-service";

describe("VibesCoding API", () => {
  it("GET / returns welcome metadata", async () => {
    const response = await app.handle(new Request("http://localhost:3000/"));
    expect(response.status).toBe(200);

    const body = (await response.json()) as any;
    expect(body.message).toBe("Welcome to VibesCoding API");
    expect(body.documentation).toBe("/swagger");
  });

  it("GET /health returns ok status", async () => {
    const response = await app.handle(new Request("http://localhost:3000/health"));
    expect(response.status).toBe(200);

    const body = (await response.json()) as any;
    expect(body.status).toBe("ok");
    expect(body.timestamp).toBeDefined();
  });

  describe("POST /api/users (User Registration)", () => {
    it("returns 201 with created user on successful registration", async () => {
      const mockUser = {
        id: 1,
        name: "ino",
        email: "ino@example.com",
        created_at: "2026-08-29T02:53:30.697Z",
      };

      const spy = spyOn(usersService, "registerUser").mockResolvedValue(mockUser);

      const response = await app.handle(
        new Request("http://localhost:3000/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: "ino",
            email: "ino@example.com",
            password: "rahasia",
          }),
        })
      );

      expect(response.status).toBe(201);
      const body = (await response.json()) as any;
      expect(body.status).toBe("success");
      expect(body.message).toBe("User registered successfully");
      expect(body.data).toEqual(mockUser);

      spy.mockRestore();
    });

    it("returns 400 when email is already registered", async () => {
      const spy = spyOn(usersService, "registerUser").mockRejectedValue(
        new usersService.DuplicateEmailError("Email already registered")
      );

      const response = await app.handle(
        new Request("http://localhost:3000/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: "ino",
            email: "duplicate@example.com",
            password: "rahasia",
          }),
        })
      );

      expect(response.status).toBe(400);
      const body = (await response.json()) as any;
      expect(body.status).toBe("error");
      expect(body.message).toBe("Email already registered");
      expect(body.data).toBeNull();

      spy.mockRestore();
    });

    it("returns 400 for invalid request body validation (invalid email format)", async () => {
      const response = await app.handle(
        new Request("http://localhost:3000/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: "ino",
            email: "invalid-email-format",
            password: "rahasia",
          }),
        })
      );

      expect([400, 422]).toContain(response.status);
    });
  });
});
