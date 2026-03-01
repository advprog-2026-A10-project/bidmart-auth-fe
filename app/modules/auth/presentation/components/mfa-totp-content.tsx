import { useState } from "react";
import { Link } from "react-router";
import { OtpInput } from "~/shared/components/ui/otp-input";
import { useVerifyMfaTotpMutation } from "~/modules/auth/presentation/hooks/use-verify-mfa-totp-mutation";
import { MfaExpiredError } from "~/modules/auth/domain/errors/auth-errors";

interface MfaTotpContentProps {
  ticket: string;
  onSuccess: () => void;
  onExpired: () => void;
}

export function MfaTotpContent({ ticket, onSuccess, onExpired }: MfaTotpContentProps) {
  const [code, setCode] = useState("");
  const verify = useVerifyMfaTotpMutation();

  function handleCodeChange(val: string) {
    setCode(val);
    if (val.length === 6) {
      verify.mutate(
        { ticket, code: val },
        {
          onSuccess: onSuccess,
          onError: (err) => {
            if (err instanceof MfaExpiredError) onExpired();
          },
        },
      );
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <OtpInput
          value={code}
          onChange={handleCodeChange}
          length={6}
          disabled={verify.isPending}
        />
      </div>

      <p className="text-muted-foreground text-center text-sm">
        <Link to="/login" className="hover:text-primary font-medium underline underline-offset-4">
          Use a different method
        </Link>
      </p>
    </div>
  );
}
