import { useEffect, useState } from "react";
import { Link } from "react-router";
import { OtpInput } from "~/shared/components/ui/otp-input";
import { Button } from "~/shared/components/ui/button";

interface MfaEmailContentProps {
  onVerify: (code: string) => void | Promise<void>;
  onResend: () => void | Promise<void>;
  isSubmitting?: boolean;
  isSending?: boolean;
}

export function MfaEmailContent({
  onVerify,
  onResend,
  isSubmitting = false,
  isSending = false,
}: MfaEmailContentProps) {
  const codeLength = 6;
  const resendCooldownSeconds = 30;
  const [code, setCode] = useState("");
  const [resendCount, setResendCount] = useState(0);
  const [cooldown, setCooldown] = useState(resendCooldownSeconds);

  function handleCodeChange(value: string) {
    const sanitized = value.replace(/\D/g, "").slice(0, codeLength);
    setCode(sanitized);
    if (sanitized.length === codeLength) {
      void onVerify(sanitized);
    }
  }

  async function handleResend() {
    if (cooldown > 0) return;
    setCode("");
    await onResend();
    setResendCount((count) => count + 1);
    setCooldown(resendCooldownSeconds);
  }

  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = window.setInterval(() => {
      setCooldown((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [cooldown]);

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <OtpInput
          value={code}
          onChange={handleCodeChange}
          length={codeLength}
          disabled={isSubmitting}
        />
      </div>
      <div className="text-center text-sm">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleResend}
          disabled={isSending || cooldown > 0}
        >
          {isSending ? "Sending..." : cooldown > 0 ? `Resend code (${cooldown}s)` : "Resend code"}
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
