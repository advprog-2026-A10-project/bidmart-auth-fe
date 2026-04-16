import { Link } from "react-router";
import { Button } from "~/shared/components/ui/button";
import { Input } from "~/shared/components/ui/input";
import { useState } from "react";
import { useResendVerificationMutation } from "../hooks/use-resend-verification-mutation";

interface VerifyEmailContentProps {
  email?: string;
}

export function VerifyEmailContent({ email }: VerifyEmailContentProps) {
  const [resendEmail, setResendEmail] = useState(email ?? "");
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const resendVerification = useResendVerificationMutation();

  async function handleResend() {
    if (!resendEmail.trim()) {
      setResendMessage("Email is required.");
      return;
    }

    const result = await resendVerification.mutateAsync({ email: resendEmail });
    setResendMessage(result.message);
  }

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground text-sm">
        We sent a verification link to your email. Click the link to activate your account.
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

      <Button
        variant="outline"
        className="w-full"
        onClick={handleResend}
        disabled={resendVerification.isPending}
      >
        {resendVerification.isPending ? "Sending..." : "Resend verification email"}
      </Button>

      {resendMessage ? <p className="text-center text-sm font-medium">{resendMessage}</p> : null}

      <p className="text-muted-foreground text-center text-sm">
        <Link to="/login" className="hover:text-primary font-medium underline underline-offset-4">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
