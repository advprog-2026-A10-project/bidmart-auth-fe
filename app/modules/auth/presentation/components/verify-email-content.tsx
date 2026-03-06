import { Link } from "react-router";
import { Button } from "~/shared/components/ui/button";
import { Input } from "~/shared/components/ui/input";
import { useState } from "react";

interface VerifyEmailContentProps {
  token?: string;
  email?: string;
  verifySuccessMessage?: string;
  resendSuccessMessage?: string;
  invalidTokenMessage?: string;
}

export function VerifyEmailContent({
  token,
  email,
  verifySuccessMessage = "Email verified.",
  resendSuccessMessage = "Verification email sent.",
  invalidTokenMessage = "Verification token is invalid or expired.",
}: VerifyEmailContentProps) {
  const [resendEmail, setResendEmail] = useState(email ?? "");
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  if (token) {
    const isInvalidToken = token.trim().toLowerCase().includes("invalid");

    return (
      <div className="flex flex-col items-center gap-4 py-4 text-center">
        <p className="text-sm font-medium text-green-600">
          {isInvalidToken ? invalidTokenMessage : verifySuccessMessage}
        </p>
        <Button asChild>
          <Link to="/login">Continue to sign in</Link>
        </Button>
      </div>
    );
  }

  function handleResend() {
    if (!resendEmail.trim()) {
      setResendMessage("Email is required.");
      return;
    }

    setResendMessage(resendSuccessMessage);
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
      {resendMessage ? <p className="text-sm font-medium">{resendMessage}</p> : null}
      <p className="text-muted-foreground text-center text-sm">
        <Link to="/login" className="hover:text-primary font-medium underline underline-offset-4">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
