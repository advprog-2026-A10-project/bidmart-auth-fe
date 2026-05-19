import { useEffect } from "react";
import { useNavigate } from "react-router";
import { AuthCard } from "../components/auth-card";
import { MfaTotpContent } from "../components/mfa-totp-content";
import { MfaExpiredError } from "~/modules/auth/domain/errors/auth-errors";
import { clearMfaTicket, readMfaTicket } from "../mfa-ticket-storage";
import { useVerifyMfaTotpMutation } from "../hooks/use-verify-mfa-totp-mutation";
import { postLoginRedirectPath } from "../post-login-redirect";

export function MfaTotpPage() {
  const ticketState = readMfaTicket();
  const ticket = ticketState?.mfaType === "totp" ? ticketState.ticket : null;
  const navigate = useNavigate();
  const verifyMfaTotp = useVerifyMfaTotpMutation();

  useEffect(() => {
    if (!ticket) {
      navigate("/login", { replace: true });
    }
  }, [ticket, navigate]);

  if (!ticket) return null;
  const mfaTicket = ticket;

  async function handleVerify(code: string) {
    try {
      await verifyMfaTotp.mutateAsync({ ticket: mfaTicket, code });
      clearMfaTicket();
      void navigate(postLoginRedirectPath());
    } catch (error) {
      if (error instanceof MfaExpiredError) {
        clearMfaTicket();
        void navigate("/auth/mfa/expired");
      }
    }
  }

  return (
    <AuthCard title="Authenticator app" description="Enter the code from your authenticator app.">
      <MfaTotpContent onVerify={handleVerify} isSubmitting={verifyMfaTotp.isPending} />
    </AuthCard>
  );
}
