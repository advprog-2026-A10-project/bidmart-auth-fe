import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { AuthCard } from "../components/auth-card";
import { MfaEmailContent } from "../components/mfa-email-content";
import { MfaExpiredError } from "~/modules/auth/domain/errors/auth-errors";
import {
  clearMfaTicket,
  readMfaTicket,
} from "~/modules/auth/infrastructure/storage/mfa-ticket-storage";
import { useSendMfaEmailMutation } from "../hooks/use-send-mfa-email-mutation";
import { useVerifyMfaEmailMutation } from "../hooks/use-verify-mfa-email-mutation";
import {
  redirectToTarget,
  resolvePostAuthRedirect,
} from "~/modules/auth/infrastructure/navigation/redirect-target";

// Strict-Mode-safe de-dupe of the initial auto-send. React 19 / Strict Mode
// double-invokes effects in development, which used to fire `sendMfaEmail`
// twice and immediately trip the backend's server-side cooldown. The Set
// lives at module scope so it survives the dev-mode unmount/remount cycle.
const autoSentTickets = new Set<string>();

export function MfaEmailPage() {
  const ticketState = readMfaTicket();
  const ticket = ticketState?.mfaType === "email" ? ticketState.ticket : null;
  const [searchParams] = useSearchParams();
  const redirectTarget = resolvePostAuthRedirect(
    searchParams.get("redirect") ?? ticketState?.redirectTarget ?? null,
  );
  const navigate = useNavigate();
  const sendMfaEmail = useSendMfaEmailMutation();
  const verifyMfaEmail = useVerifyMfaEmailMutation();
  const sendEmail = sendMfaEmail.mutateAsync;

  // Bumped on each manual resend; MfaEmailContent resets its countdown on every increment.
  // (The initial auto-send countdown starts from MfaEmailContent's initial state.)
  const [cooldownSignal, setCooldownSignal] = useState(0);
  // Bumped on each verify failure to ask MfaEmailContent to clear the OTP
  // input so the user can retype without manually clearing.
  const [resetCodeSignal, setResetCodeSignal] = useState(0);

  useEffect(() => {
    if (!ticket) {
      navigate("/auth/login", { replace: true });
      return;
    }

    if (autoSentTickets.has(ticket)) return;
    autoSentTickets.add(ticket);

    void sendEmail({ ticket }).catch(() => {});
  }, [sendEmail, ticket, navigate]);

  if (!ticket) return null;
  const mfaTicket = ticket;

  async function handleVerify(code: string) {
    try {
      await verifyMfaEmail.mutateAsync({ ticket: mfaTicket, code });
      clearMfaTicket();
      redirectToTarget(redirectTarget);
    } catch (error) {
      if (error instanceof MfaExpiredError) {
        clearMfaTicket();
        void navigate("/auth/mfa/expired");
        return;
      }
      // Any other failure (invalid code, network, etc.) — clear the OTP so
      // the user can retype.
      setResetCodeSignal((value) => value + 1);
    }
  }

  async function handleResend() {
    setCooldownSignal((n) => n + 1);
    try {
      await sendMfaEmail.mutateAsync({ ticket: mfaTicket });
    } catch {
      // error handled by the mutation hook's onError toast
    }
  }

  return (
    <AuthCard title="Email verification" description="Enter the code sent to your email.">
      <MfaEmailContent
        onVerify={handleVerify}
        onResend={handleResend}
        isSubmitting={verifyMfaEmail.isPending}
        cooldownSignal={cooldownSignal}
        resetCodeSignal={resetCodeSignal}
      />
    </AuthCard>
  );
}
