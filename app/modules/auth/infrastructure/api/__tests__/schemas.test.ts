import { describe, expect, it } from "vitest";
import { loginResponseApiSchema, mfaVerifyApiSchema } from "../schemas";
import { getMfaStatusApiSchema, setupMfaTotpApiSchema, messageApiSchema } from "~/modules/settings/infrastructure/api/schemas";

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
    expect(setupMfaTotpApiSchema.parse({ qrCodeUrl: "https://example.test/qr", secret: "SECRET" })).toMatchObject({
      secret: "SECRET",
    });
    expect(messageApiSchema.parse({ message: "ok" })).toEqual({ message: "ok" });
  });
});
