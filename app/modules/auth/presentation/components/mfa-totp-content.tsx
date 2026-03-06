import { useState } from "react";
import { Link } from "react-router";
import { OtpInput } from "~/shared/components/ui/otp-input";

interface MfaTotpContentProps {
  ticket: string;
  onSuccess: () => void;
  onExpired: () => void;
  verifyCode?: string;
  expiredMessage?: string;
}

export function MfaTotpContent({
  ticket,
  onSuccess,
  onExpired,
  verifyCode = "123456",
  expiredMessage = "The MFA code has expired. Please try again.",
}: MfaTotpContentProps) {
  const codeLength = verifyCode.length;
  const [code, setCode] = useState("");
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

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground text-center text-xs">Ticket: {ticket}</p>
      <div className="flex justify-center">
        <OtpInput value={code} onChange={handleCodeChange} length={codeLength} />
      </div>
      {feedback ? <p className="text-center text-sm font-medium">{feedback}</p> : null}

      <p className="text-muted-foreground text-center text-sm">
        <Link to="/login" className="hover:text-primary font-medium underline underline-offset-4">
          Use a different method
        </Link>
      </p>
    </div>
  );
}
