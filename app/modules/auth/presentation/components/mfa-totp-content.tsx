import { useState } from "react";
import { Link } from "react-router";
import { OtpInput } from "~/shared/components/ui/otp-input";

interface MfaTotpContentProps {
  onVerify: (code: string) => void | Promise<void>;
  isSubmitting?: boolean;
}

export function MfaTotpContent({ onVerify, isSubmitting = false }: MfaTotpContentProps) {
  const codeLength = 6;
  const [code, setCode] = useState("");

  function handleCodeChange(value: string) {
    const sanitized = value.replace(/\D/g, "").slice(0, codeLength);
    setCode(sanitized);

    if (sanitized.length === codeLength) {
      void onVerify(sanitized);
    }
  }

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

      <p className="text-muted-foreground text-center text-sm">
        <Link
          to="/auth/login"
          className="hover:text-primary font-medium underline underline-offset-4"
        >
          Use a different method
        </Link>
      </p>
    </div>
  );
}
