import { useState, useEffect } from "react";
import { Link } from "react-router";
import { OtpInput } from "~/shared/components/ui/otp-input";
import { Button } from "~/shared/components/ui/button";
import { useSendMfaEmailMutation } from "~/modules/auth/presentation/hooks/use-send-mfa-email-mutation";
import { useVerifyMfaEmailMutation } from "~/modules/auth/presentation/hooks/use-verify-mfa-email-mutation";
import { MfaExpiredError } from "~/modules/auth/domain/errors/auth-errors";

interface MfaEmailContentProps {
  ticket: string;
  onSuccess: () => void;
  onExpired: () => void;
}

export function MfaEmailContent({ ticket, onSuccess, onExpired }: MfaEmailContentProps) {
  const [code, setCode] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(30);
  const [isExpired, setIsExpired] = useState(false);

  const send = useSendMfaEmailMutation();
  const verify = useVerifyMfaEmailMutation();

  useEffect(() => {
    send.mutate({ ticket });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isExpired) return;
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(id);
          setIsExpired(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [isExpired]);

  function handleResend() {
    setIsExpired(false);
    setSecondsLeft(30);
    setCode("");
    send.mutate({ ticket });
  }

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
          disabled={verify.isPending || isExpired}
        />
      </div>

      <div className="text-center text-sm">
        {isExpired ? (
          <div className="space-y-2">
            <p className="text-destructive">Code expired. Request a new code.</p>
            <Button variant="outline" size="sm" onClick={handleResend} disabled={send.isPending}>
              {send.isPending ? "Sending..." : "Resend Code"}
            </Button>
          </div>
        ) : (
          <p className="text-muted-foreground">
            Code expires in 00:{secondsLeft.toString().padStart(2, "0")}
          </p>
        )}
      </div>

      <p className="text-muted-foreground text-center text-sm">
        <Link to="/login" className="hover:text-primary font-medium underline underline-offset-4">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
