import { useEffect, useState } from "react";
import { Link } from "react-router";
import { OtpInput } from "~/shared/components/ui/otp-input";
import { Button } from "~/shared/components/ui/button";

interface MfaEmailContentProps {
  onVerify: (code: string) => void | Promise<void>;
  onResend: () => void | Promise<void>;
  /** True while either the initial auto-send or a manual resend is in flight. */
  isSending?: boolean;
  /** True while the verify mutation is in flight. */
  isSubmitting?: boolean;
  /**
   * Unix epoch (ms) when the parent considers the resend cooldown to expire.
   * `null` ⇒ no cooldown active (e.g. initial mount before the first send
   * completes). The parent sets this each time a send settles so the
   * countdown reflects real backend cooldown, not page-mount time.
   */
  cooldownUntil?: number | null;
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

function remainingSeconds(cooldownUntil: number | null | undefined, now: number): number {
  if (!cooldownUntil) return 0;
  const diffMs = cooldownUntil - now;
  return diffMs <= 0 ? 0 : Math.ceil(diffMs / 1000);
}

export function MfaEmailContent({
  onVerify,
  onResend,
  isSubmitting = false,
  isSending = false,
  cooldownUntil = null,
  resetCodeSignal = 0,
}: MfaEmailContentProps) {
  const [code, setCode] = useState("");
  const [resendCount, setResendCount] = useState(0);
  // `now` is a 1-second tick driven by setInterval below. Computing the
  // remaining countdown from (`cooldownUntil` - `now`) keeps the effect
  // pure (no setState-in-effect): it only updates an external-clock-like
  // value, and the render derives the rest.
  const [now, setNow] = useState(() => Date.now());

  // React "reset state on prop change" pattern (https://react.dev/reference/react/useState#storing-information-from-previous-renders):
  // detect the signal change during render and reset `code` without an
  // effect. React batches the setState into the same render cycle, so this
  // does NOT cause cascading renders.
  const [lastResetSignal, setLastResetSignal] = useState(resetCodeSignal);
  if (lastResetSignal !== resetCodeSignal) {
    setLastResetSignal(resetCodeSignal);
    setCode("");
  }

  useEffect(() => {
    if (!cooldownUntil) return;
    if (cooldownUntil <= Date.now()) return;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [cooldownUntil]);

  const remaining = remainingSeconds(cooldownUntil, now);

  function handleCodeChange(value: string) {
    const sanitized = value.replace(/\D/g, "").slice(0, CODE_LENGTH);
    setCode(sanitized);
    if (sanitized.length === CODE_LENGTH) {
      void onVerify(sanitized);
    }
  }

  async function handleResend() {
    if (remaining > 0 || isSending) return;
    setCode("");
    await onResend();
    setResendCount((count) => count + 1);
  }

  const buttonLabel = isSending
    ? "Sending..."
    : remaining > 0
      ? `Resend code (${remaining}s)`
      : "Resend code";

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
      <div className="text-center text-sm">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleResend}
          disabled={isSending || remaining > 0}
        >
          {buttonLabel}
        </Button>
        {resendCount > 0 ? (
          <p className="text-muted-foreground mt-2 text-xs">Code resent ({resendCount})</p>
        ) : null}
      </div>
      <p className="text-muted-foreground text-center text-sm">
        <Link to="/login" className="hover:text-primary font-medium underline underline-offset-4">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
