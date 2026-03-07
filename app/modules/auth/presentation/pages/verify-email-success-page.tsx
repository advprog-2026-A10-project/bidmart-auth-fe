import { Link } from "react-router";
import { CheckCircle } from "lucide-react";
import { AuthCard } from "../components/auth-card";
import { Button } from "~/shared/components/ui/button";

/**
 * VerifyEmailSuccessPage — 1.1.4.
 * Shown after a successful email verification.
 */
export function VerifyEmailSuccessPage() {
  return (
    <AuthCard title="Email verified!" description="Your account is now active.">
      <div className="flex flex-col items-center gap-6 py-2 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>

        <p className="text-muted-foreground text-sm">
          Great, your email has been successfully verified. You can now sign in to your account.
        </p>

        <Button asChild className="w-full">
          <Link to="/login">Continue to sign in</Link>
        </Button>
      </div>
    </AuthCard>
  );
}
