import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { AuthCard } from "../components/auth-card";
import { MfaEmailContent } from "../components/mfa-email-content";
import { MfaExpiredError } from "~/modules/auth/domain/errors/auth-errors";
import { clearMfaTicket, readMfaTicket } from "../mfa-ticket-storage";
import { useSendMfaEmailMutation } from "../hooks/use-send-mfa-email-mutation";
import { useVerifyMfaEmailMutation } from "../hooks/use-verify-mfa-email-mutation";

export function MfaEmailPage() {
  const ticketState = readMfaTicket();
  const ticket = ticketState?.mfaType === "email" ? ticketState.ticket : null;
  const navigate = useNavigate();
  const sendMfaEmail = useSendMfaEmailMutation();
  const verifyMfaEmail = useVerifyMfaEmailMutation();
  const initialSendTicketRef = useRef<string | null>(null);
  const sendEmail = sendMfaEmail.mutateAsync;

  useEffect(() => {
    if (!ticket) {
      navigate("/login", { replace: true });
      return;
    }

    if (initialSendTicketRef.current === ticket) return;
    initialSendTicketRef.current = ticket;
    void sendEmail({ ticket });
  }, [sendEmail, ticket, navigate]);

  if (!ticket) return null;
  const mfaTicket = ticket;

  async function handleVerify(code: string) {
    try {
      await verifyMfaEmail.mutateAsync({ ticket: mfaTicket, code });
      clearMfaTicket();
      void navigate("/posts");
    } catch (error) {
      if (error instanceof MfaExpiredError) {
        clearMfaTicket();
        void navigate("/auth/mfa/expired");
      }
    }
  }

  async function handleResend() {
    await sendMfaEmail.mutateAsync({ ticket: mfaTicket });
  }

  return (
    <AuthCard title="Email verification" description="Enter the code sent to your email.">
      <MfaEmailContent
        onVerify={handleVerify}
        onResend={handleResend}
        isSubmitting={verifyMfaEmail.isPending}
        isSending={sendMfaEmail.isPending}
      />
    </AuthCard>
  );
}
