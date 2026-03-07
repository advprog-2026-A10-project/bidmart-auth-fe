import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { AuthCard } from "../components/auth-card";
import { MfaEmailContent } from "../components/mfa-email-content";
import { AUTH_PAGE_MOCK_PAYLOADS } from "./constant";

export function MfaEmailPage() {
  const mfaEmailMock = AUTH_PAGE_MOCK_PAYLOADS.mfaEmail;
  const [searchParams] = useSearchParams();
  const ticket = searchParams.get("ticket") ?? mfaEmailMock.verifyRequest.ticket;
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
      title="Email verification"
      description="Placeholder MFA-email using mock payload contract."
    >
      <MfaEmailContent
        ticket={ticket}
        onSuccess={handleSuccess}
        onExpired={handleExpired}
        verifyCode={mfaEmailMock.verifyRequest.code}
        resendMessage={mfaEmailMock.response.sendCodeSuccess.message}
        expiredMessage={mfaEmailMock.response.expiredError.message}
      />
    </AuthCard>
  );
}
