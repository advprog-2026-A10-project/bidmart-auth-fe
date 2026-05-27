import { describe, expect, it } from "vitest";
import { loginResponseApiSchema, mfaVerifyApiSchema } from "../schemas";
import {
  getMfaStatusApiSchema,
  setupMfaTotpApiSchema,
  messageApiSchema,
} from "~/modules/settings/infrastructure/api/schemas";

describe("API schema contracts", () => {
  it("accepts login success and MFA-required branches", () => {
    expect(
      loginResponseApiSchema.parse({
        requiresMfa: false,
        user: { id: "user-1", name: "Alice", email: "alice@example.com", emailVerified: true },
        accessToken: "jwt",
      }),
    ).toMatchObject({ requiresMfa: false });

    expect(
      loginResponseApiSchema.parse({
        requiresMfa: true,
        ticket: "ticket-123",
        mfaType: "email",
      }),
    ).toMatchObject({ requiresMfa: true, ticket: "ticket-123" });
  });

  it("accepts MFA verify, MFA status, TOTP setup, and message envelopes", () => {
    expect(
      mfaVerifyApiSchema.parse({
        user: { id: "user-1", name: "Alice", email: "alice@example.com", emailVerified: true },
        accessToken: "jwt",
      }),
    ).toMatchObject({ accessToken: "jwt" });
    expect(getMfaStatusApiSchema.parse({ mfaEnabled: true, mfaType: "totp" })).toMatchObject({
      mfaEnabled: true,
      mfaType: "totp",
    });
    expect(
      setupMfaTotpApiSchema.parse({
        setupTicket: "setup-ticket",
        secret: "SECRET",
        otpauthUrl: "otpauth://totp/BidMart:alice@example.com?secret=SECRET&issuer=BidMart",
      }),
    ).toMatchObject({
      setupTicket: "setup-ticket",
      secret: "SECRET",
      otpauthUrl: expect.stringContaining("otpauth://"),
    });
    expect(messageApiSchema.parse({ message: "ok" })).toEqual({ message: "ok" });
  });

  it("rejects login and MFA responses without a usable access token", () => {
    expect(() =>
      loginResponseApiSchema.parse({
        requiresMfa: false,
        user: { id: "user-1", name: "Alice", email: "alice@example.com", emailVerified: true },
        accessToken: "",
      }),
    ).toThrow();

    expect(() =>
      mfaVerifyApiSchema.parse({
        user: { id: "user-1", name: "Alice", email: "alice@example.com", emailVerified: true },
        accessToken: "",
      }),
    ).toThrow();
  });
});
