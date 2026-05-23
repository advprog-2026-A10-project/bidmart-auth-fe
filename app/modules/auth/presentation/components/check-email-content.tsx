import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Mail } from "lucide-react";
import { Button } from "~/shared/components/ui/button";
import { Input } from "~/shared/components/ui/input";
import { useResendVerificationMutation } from "../hooks/use-resend-verification-mutation";

const COOLDOWN_SECONDS = 30;

interface CheckEmailContentProps {
  email?: string;
  initialCooldownSeconds?: number;
}

/**
 * CheckEmailContent — shown after registration.
 *
 * Informs the user to check their inbox and provides a resend button
 * with a 30-second cooldown to prevent spam.
 */
export function CheckEmailContent({
  email,
  initialCooldownSeconds = COOLDOWN_SECONDS,
}: CheckEmailContentProps) {
  const resendVerification = useResendVerificationMutation();
  const [cooldown, setCooldown] = useState(initialCooldownSeconds);
  const [resendEmail, setResendEmail] = useState(email ?? "");
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  useEffect(() => {
    if (cooldown <= 0) {
      return;
    }

    const timer = window.setTimeout(() => {
      setCooldown((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [cooldown]);

  async function handleResend() {
    if (cooldown > 0) return;
    const normalizedEmail = resendEmail.trim().toLowerCase();
    if (!normalizedEmail) {
      setResendMessage("Email is required.");
      return;
    }

    if (!isLikelyEmail(normalizedEmail)) {
      setResendMessage("Enter a valid email address.");
      return;
    }

    try {
      const result = await resendVerification.mutateAsync({ email: normalizedEmail });
      setResendMessage(result.message);
      setCooldown(initialCooldownSeconds);
    } catch {
      // Error toast is handled by the mutation hook.
    }
  }

  const isDisabled = cooldown > 0 || resendVerification.isPending;

  return (
    <div className="flex flex-col items-center gap-6 py-2 text-center">
      <div className="bg-primary/10 flex h-16 w-16 items-center justify-center rounded-full">
        <Mail className="text-primary h-8 w-8" />
      </div>

      <div className="space-y-2">
        <p className="text-muted-foreground text-sm">
          We sent a verification link to{" "}
          {email ? <span className="text-foreground font-medium">{email}</span> : "your email"}.
          Click the link in the email to activate your account.
        </p>
        <p className="text-muted-foreground text-xs">
          Don&apos;t forget to check your spam folder.
        </p>
      </div>

      <div className="w-full space-y-3">
        <div className="space-y-2 text-left">
          <label className="text-sm font-medium" htmlFor="check-email-resend-input">
            Email address
          </label>
          <Input
            id="check-email-resend-input"
            type="email"
            value={resendEmail}
            onChange={(event) => setResendEmail(event.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </div>
        <Button variant="outline" className="w-full" onClick={handleResend} disabled={isDisabled}>
          {resendVerification.isPending
            ? "Sending..."
            : cooldown > 0
              ? `Resend email (${cooldown}s)`
              : "Resend verification email"}
        </Button>
        {resendMessage ? <p className="text-sm font-medium">{resendMessage}</p> : null}

        <p className="text-muted-foreground text-center text-sm">
          <Link
            to="/auth/login"
            className="hover:text-primary font-medium underline underline-offset-4"
          >
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

function isLikelyEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
