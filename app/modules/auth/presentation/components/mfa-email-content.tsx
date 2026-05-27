import { useEffect, useState } from "react";
import { Link } from "react-router";
import { OtpInput } from "~/shared/components/ui/otp-input";
import { Button } from "~/shared/components/ui/button";

// Matches the backend's email_mfa_cooldown policy (bidmart-auth-be).
const RESEND_COOLDOWN_SECONDS = 30;

interface MfaEmailContentProps {
  onVerify: (code: string) => void | Promise<void>;
  onResend: () => void | Promise<void>;
  /** True while the verify mutation is in flight. */
  isSubmitting?: boolean;
  /**
   * Monotonically increasing counter: the parent bumps this on each manual
   * resend. The child resets its local countdown to RESEND_COOLDOWN_SECONDS
   * on each bump. (The initial countdown starts from component mount state,
   * not from this signal.)
   */
  cooldownSignal?: number;
  /**
   * Monotonically increasing signal: every time the parent wants the local
   * code state cleared (typically after a failed verify) it bumps this
   * number. We detect the change in render via the documented React
   * "store information from previous renders" pattern — no setState in
   * effect, no full unmount.
   */
  resetCodeSignal?: number;
}

const CODE_LENGTH = 6;

export function MfaEmailContent({
  onVerify,
  onResend,
  isSubmitting = false,
  cooldownSignal = 0,
  resetCodeSignal = 0,
}: MfaEmailContentProps) {
  const [code, setCode] = useState("");
  const [resendCount, setResendCount] = useState(0);

  // "Store information from previous renders" pattern: when cooldownSignal
  // increments (parent sends an email), reset the local countdown to
  // RESEND_COOLDOWN_SECONDS — no Date.now() during render, no setState in
  // effect body.
  const [lastCooldownSignal, setLastCooldownSignal] = useState(cooldownSignal);
  // Start at RESEND_COOLDOWN_SECONDS so the countdown is visible immediately
  // when the page loads (mirrors CheckEmailContent's initialCooldownSeconds pattern).
  const [cooldownSeconds, setCooldownSeconds] = useState(RESEND_COOLDOWN_SECONDS);
  if (lastCooldownSignal !== cooldownSignal) {
    setLastCooldownSignal(cooldownSignal);
    setCooldownSeconds(cooldownSignal > 0 ? RESEND_COOLDOWN_SECONDS : 0);
  }

  const [lastResetSignal, setLastResetSignal] = useState(resetCodeSignal);
  if (lastResetSignal !== resetCodeSignal) {
    setLastResetSignal(resetCodeSignal);
    setCode("");
  }

  // Decrement the countdown one second at a time.
  useEffect(() => {
    if (cooldownSeconds <= 0) return;
    const timer = window.setTimeout(() => {
      setCooldownSeconds((prev) => Math.max(prev - 1, 0));
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [cooldownSeconds]);

  const remaining = cooldownSeconds;

  function handleCodeChange(value: string) {
    const sanitized = value.replace(/\D/g, "").slice(0, CODE_LENGTH);
    setCode(sanitized);
    if (sanitized.length === CODE_LENGTH) {
      void onVerify(sanitized);
    }
  }

  async function handleResend() {
    if (remaining > 0) return;
    setCode("");
    await onResend();
    setResendCount((count) => count + 1);
  }

  const buttonLabel = remaining > 0 ? `Resend code (${remaining}s)` : "Resend code";

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <OtpInput
          value={code}
          onChange={handleCodeChange}
          length={CODE_LENGTH}
          disabled={isSubmitting}
        />
      </div>
      <div className="space-y-2">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleResend}
          disabled={remaining > 0}
        >
          {buttonLabel}
        </Button>
        {resendCount > 0 ? (
          <p className="text-muted-foreground text-center text-xs">Code resent ({resendCount})</p>
        ) : null}
      </div>
      <p className="text-muted-foreground text-center text-sm">
        <Link
          to="/auth/login"
          className="hover:text-primary font-medium underline underline-offset-4"
        >
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
