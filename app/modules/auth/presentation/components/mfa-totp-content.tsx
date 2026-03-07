import { toast } from "sonner";
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

  function handleCodeChange(val: string) {
    const sanitized = val.replace(/\D/g, "").slice(0, codeLength);
    setCode(sanitized);

    if (sanitized.length === codeLength) {
      if (sanitized === "000000") {
        toast.error(expiredMessage);
        onExpired();
        return;
      }

      if (sanitized !== verifyCode) {
        toast.error("Invalid MFA code.");
        return;
      }

      toast.success("MFA verification successful.");
      onSuccess();
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground text-center text-xs">Ticket: {ticket}</p>
      <div className="flex justify-center">
        <OtpInput value={code} onChange={handleCodeChange} length={codeLength} />
      </div>

      <p className="text-muted-foreground text-center text-sm">
        <Link to="/login" className="hover:text-primary font-medium underline underline-offset-4">
          Use a different method
        </Link>
      </p>
    </div>
  );
}
