import { AuthCard } from "../components/auth-card";
import { VerifyEmailContent } from "../components/verify-email-content";

export function VerifyEmailPage() {
  return (
    <AuthCard title="Verify your email" description="Open the verification link from your email.">
      <VerifyEmailContent />
    </AuthCard>
  );
}
