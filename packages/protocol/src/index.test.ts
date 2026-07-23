import { describe, expect, it } from "vitest";

import { formatRoomCode, normalizeRoomCode } from "./index";

describe("room codes", () => {
  it("normalizes case and the presentation separator", () => {
    expect(normalizeRoomCode(" w0rf-7k2m ")).toBe("W0RF7K2M");
    expect(formatRoomCode("w0rf7k2m")).toBe("W0RF-7K2M");
  });

  it("rejects ambiguous Crockford characters and invalid lengths", () => {
    expect(normalizeRoomCode("WOLI-7K2M")).toBeNull();
    expect(normalizeRoomCode("WOLF-7K2")).toBeNull();
  });
});
