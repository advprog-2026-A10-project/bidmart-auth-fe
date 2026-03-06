import { useState } from "react";
import { Link } from "react-router";
import { Input } from "~/shared/components/ui/input";
import { Button } from "~/shared/components/ui/button";

interface VerifyEmailContentProps {
  token?: string;
  email?: string;
  mockVerifySuccessMessage?: string;
  mockResendSuccessMessage?: string;
}

export function VerifyEmailContent({
  token,
  email,
  mockVerifySuccessMessage = "Email verified.",
  mockResendSuccessMessage = "Verification email sent.",
}: VerifyEmailContentProps) {
  const [resendEmail, setResendEmail] = useState(email ?? "");
  const [feedback, setFeedback] = useState<string | null>(null);

  if (token) {
    return (
      <div className="flex flex-col items-center gap-4 py-4 text-center">
        <p className="text-sm font-medium text-green-600">{mockVerifySuccessMessage}</p>
        <Button asChild>
          <Link to="/login">Continue to sign in</Link>
        </Button>
      </div>
    );
  }

  function handleResend() {
    if (!resendEmail.trim()) {
      setFeedback("Email is required.");
      return;
    }

    setFeedback(mockResendSuccessMessage);
  }

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground text-sm">
        Request payload preview: <code>{JSON.stringify({ email: resendEmail || "" })}</code>
      </p>

      <p className="text-muted-foreground text-sm">
        We sent a verification link to {email ?? "your email"}. Click the link to activate your
        account.
      </p>

      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="verify-email-resend-input">
          Email address
        </label>
        <Input
          id="verify-email-resend-input"
          type="email"
          value={resendEmail}
          onChange={(event) => setResendEmail(event.target.value)}
          placeholder="you@example.com"
        />
      </div>

      <Button type="button" variant="outline" className="w-full" onClick={handleResend}>
        Resend verification email
      </Button>

      {feedback ? <p className="text-sm font-medium">{feedback}</p> : null}

      <p className="text-muted-foreground text-center text-sm">
        <Link to="/login" className="hover:text-primary font-medium underline underline-offset-4">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
