import { useState } from "react";
import { Link } from "react-router";
import { OtpInput } from "~/shared/components/ui/otp-input";
import { Button } from "~/shared/components/ui/button";

interface MfaEmailContentProps {
  ticket: string;
  onSuccess: () => void;
  onExpired: () => void;
  verifyCode?: string;
  resendMessage?: string;
  expiredMessage?: string;
}

export function MfaEmailContent({
  ticket,
  onSuccess,
  onExpired,
  verifyCode = "123456",
  resendMessage = "MFA code sent.",
  expiredMessage = "The MFA code has expired. Please try again.",
}: MfaEmailContentProps) {
  const codeLength = verifyCode.length;
  const [code, setCode] = useState("");
  const [resendCount, setResendCount] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  function handleCodeChange(val: string) {
    const sanitized = val.replace(/\D/g, "").slice(0, codeLength);
    setCode(sanitized);
    if (sanitized.length === codeLength) {
      if (sanitized === "000000") {
        setFeedback(expiredMessage);
        onExpired();
        return;
      }
      if (sanitized !== verifyCode) {
        setFeedback("Invalid MFA code.");
        return;
      }
      setFeedback("MFA verification successful.");
      onSuccess();
    }
  }

  function handleResend() {
    setCode("");
    setResendCount((count) => count + 1);
    setFeedback(resendMessage);
  }

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground text-center text-xs">Ticket: {ticket}</p>
      <div className="flex justify-center">
        <OtpInput value={code} onChange={handleCodeChange} length={codeLength} />
      </div>
      <div className="text-center text-sm">
        <Button type="button" variant="outline" size="sm" onClick={handleResend}>
          Resend code
        </Button>
        {resendCount > 0 ? (
          <p className="text-muted-foreground mt-2 text-xs">Code resent ({resendCount})</p>
        ) : null}
      </div>
      {feedback ? <p className="text-center text-sm font-medium">{feedback}</p> : null}
      <p className="text-muted-foreground text-center text-sm">
        <Link to="/login" className="hover:text-primary font-medium underline underline-offset-4">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
