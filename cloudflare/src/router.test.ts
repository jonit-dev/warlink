import { describe, expect, it } from "vitest";

import { route } from "./router";

describe("control-plane router", () => {
  it("returns a non-cacheable health response", async () => {
    const response = route(new Request("https://warlink.test/health"));

    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("no-store");
    await expect(response.json()).resolves.toEqual({
      service: "warlink-control-plane",
      status: "ok",
    });
  });

  it("does not imply that product endpoints exist", () => {
    const response = route(new Request("https://warlink.test/v1/rooms"));

    expect(response.status).toBe(501);
  });
});
