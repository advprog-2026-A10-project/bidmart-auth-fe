import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { Mail } from "lucide-react";
import { Button } from "~/shared/components/ui/button";
import { useResendVerificationMutation } from "../hooks/use-resend-verification-mutation";

const COOLDOWN_SECONDS = 30;

/**
 * CheckEmailContent — shown after registration.
 *
 * Informs the user to check their inbox and provides a resend button
 * with a 30-second cooldown to prevent spam.
 */
export function CheckEmailContent({ email }: { email?: string }) {
  const resendVerification = useResendVerificationMutation();
  const [cooldown, setCooldown] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (cooldown <= 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          const id = intervalRef.current;
          if (id) clearInterval(id);
          intervalRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [cooldown]);

  function handleResend() {
    if (!email || cooldown > 0 || resendVerification.isPending) return;
    resendVerification.mutate(
      { email },
      {
        onSuccess: () => {
          setCooldown(COOLDOWN_SECONDS);
        },
      },
    );
  }

  const isDisabled = cooldown > 0 || resendVerification.isPending || !email;

  return (
    <div className="flex flex-col items-center gap-6 py-2 text-center">
      <div className="bg-primary/10 flex h-16 w-16 items-center justify-center rounded-full">
        <Mail className="text-primary h-8 w-8" />
      </div>

      <div className="space-y-2">
        <p className="text-muted-foreground text-sm">
          We sent a verification link to{" "}
          {email ? (
            <span className="text-foreground font-medium">{email}</span>
          ) : (
            "your email address"
          )}
          . Click the link in the email to activate your account.
        </p>
        <p className="text-muted-foreground text-xs">
          Don&apos;t forget to check your spam folder.
        </p>
      </div>

      <div className="w-full space-y-3">
        <Button variant="outline" className="w-full" onClick={handleResend} disabled={isDisabled}>
          {resendVerification.isPending
            ? "Sending..."
            : cooldown > 0
              ? `Resend email (${cooldown}s)`
              : "Resend verification email"}
        </Button>

        <p className="text-muted-foreground text-center text-sm">
          <Link to="/login" className="hover:text-primary font-medium underline underline-offset-4">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
