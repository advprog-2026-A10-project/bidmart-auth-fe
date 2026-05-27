import { describe, expect, it, beforeEach } from "vitest";
import { readMfaTicket, storeMfaTicket } from "../mfa-ticket-storage";

describe("mfa ticket storage", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("preserves redirectTarget when reading from storage", () => {
    storeMfaTicket({
      ticket: "ticket-123",
      mfaType: "totp",
      redirectTarget: "https://app.example.com/orders",
    });

    expect(readMfaTicket()).toEqual({
      ticket: "ticket-123",
      mfaType: "totp",
      redirectTarget: "https://app.example.com/orders",
    });
  });

  it("keeps redirectTarget when reading from router state", () => {
    const state = {
      ticket: "ticket-456",
      mfaType: "email" as const,
      redirectTarget: "https://app.example.com/catalog",
    };

    expect(readMfaTicket(state)).toEqual(state);
    expect(readMfaTicket()).toEqual(state);
  });
});
