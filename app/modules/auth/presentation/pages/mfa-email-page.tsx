import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { AuthCard } from "../components/auth-card";
import { MfaEmailContent } from "../components/mfa-email-content";
import { MfaExpiredError } from "~/modules/auth/domain/errors/auth-errors";
import { clearMfaTicket, readMfaTicket } from "../mfa-ticket-storage";
import { useSendMfaEmailMutation } from "../hooks/use-send-mfa-email-mutation";
import { useVerifyMfaEmailMutation } from "../hooks/use-verify-mfa-email-mutation";
import {
  redirectToTarget,
  resolvePostAuthRedirect,
} from "~/modules/auth/presentation/redirect-target";

// Backend enforces a 30-second cooldown between consecutive email-MFA sends
// (see `policy.email_mfa_cooldown` in bidmart-auth-be). The client mirrors
// that so the resend button is honest about when the user can retry.
const RESEND_COOLDOWN_MS = 30_000;

// Strict-Mode-safe de-dupe of the initial auto-send. React 19 / Strict Mode
// double-invokes effects in development, which used to fire `sendMfaEmail`
// twice and immediately trip the backend's server-side cooldown. The Set
// lives at module scope so it survives the dev-mode unmount/remount cycle.
const autoSentTickets = new Set<string>();

export function MfaEmailPage() {
  const ticketState = readMfaTicket();
  const ticket = ticketState?.mfaType === "email" ? ticketState.ticket : null;
  const redirectTarget = resolvePostAuthRedirect(ticketState?.redirectTarget ?? null);
  const navigate = useNavigate();
  const sendMfaEmail = useSendMfaEmailMutation();
  const verifyMfaEmail = useVerifyMfaEmailMutation();
  const sendEmail = sendMfaEmail.mutateAsync;

  // `cooldownUntil` is the timestamp at which the resend button is allowed
  // to be clicked again. It starts as `null` (no cooldown) and is set every
  // time a send settles — initial auto-send or manual resend.
  const [cooldownUntil, setCooldownUntil] = useState<number | null>(null);
  // Bumped on each verify failure to ask MfaEmailContent to clear the OTP
  // input so the user can retype without manually clearing.
  const [resetCodeSignal, setResetCodeSignal] = useState(0);

  useEffect(() => {
    if (!ticket) {
      navigate("/login", { replace: true });
      return;
    }

    if (autoSentTickets.has(ticket)) return;
    autoSentTickets.add(ticket);

    void sendEmail({ ticket })
      .catch(() => {
        // Mutation hook already toasts; nothing to do here besides letting
        // the cooldown kick in via finally below.
      })
      .finally(() => {
        setCooldownUntil(Date.now() + RESEND_COOLDOWN_MS);
      });
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
    try {
      await sendMfaEmail.mutateAsync({ ticket: mfaTicket });
    } finally {
      setCooldownUntil(Date.now() + RESEND_COOLDOWN_MS);
    }
  }

  return (
    <AuthCard title="Email verification" description="Enter the code sent to your email.">
      <MfaEmailContent
        onVerify={handleVerify}
        onResend={handleResend}
        isSubmitting={verifyMfaEmail.isPending}
        isSending={sendMfaEmail.isPending}
        cooldownUntil={cooldownUntil}
        resetCodeSignal={resetCodeSignal}
      />
    </AuthCard>
  );
}
