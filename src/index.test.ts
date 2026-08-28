import { describe, expect, it } from "bun:test";
import { app } from "./index";

describe("VibesCoding API", () => {
  it("GET / returns welcome metadata", async () => {
    const response = await app.handle(new Request("http://localhost:3000/"));
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.message).toBe("Welcome to VibesCoding API");
    expect(body.documentation).toBe("/swagger");
  });

  it("GET /health returns ok status", async () => {
    const response = await app.handle(new Request("http://localhost:3000/health"));
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.status).toBe("ok");
    expect(body.timestamp).toBeDefined();
  });
});
