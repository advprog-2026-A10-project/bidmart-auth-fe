import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { AuthCard } from "../components/auth-card";
import { MfaTotpContent } from "../components/mfa-totp-content";
import { AUTH_PAGE_MOCK_PAYLOADS } from "./constant";

export function MfaTotpPage() {
  const mfaTotpMock = AUTH_PAGE_MOCK_PAYLOADS.mfaTotp;
  const [searchParams] = useSearchParams();
  const ticket = searchParams.get("ticket") ?? mfaTotpMock.verifyRequest.ticket;
  const navigate = useNavigate();

  useEffect(() => {
    if (!ticket) {
      navigate("/login", { replace: true });
    }
  }, [ticket, navigate]);

  if (!ticket) return null;

  function handleSuccess() {
    void navigate("/posts");
  }

  function handleExpired() {
    void navigate("/mfa/expired");
  }

  return (
    <AuthCard
      title="Authenticator app"
      description="Placeholder MFA-TOTP using mock request/response payloads."
    >
      <MfaTotpContent
        ticket={ticket}
        onSuccess={handleSuccess}
        onExpired={handleExpired}
        verifyCode={mfaTotpMock.verifyRequest.code}
        expiredMessage={mfaTotpMock.response.expiredError.message}
      />
    </AuthCard>
  );
}
