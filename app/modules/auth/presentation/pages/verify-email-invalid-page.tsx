import { Link } from "react-router";
import { XCircle } from "lucide-react";
import { AuthCard } from "../components/auth-card";
import { Button } from "~/shared/components/ui/button";

/**
 * VerifyEmailInvalidPage — 1.1.6.
 * Shown when the verification token is malformed or unrecognised.
 */
export function VerifyEmailInvalidPage() {
  return (
    <AuthCard title="Invalid link" description="This verification link is not valid.">
      <div className="flex flex-col items-center gap-6 py-2 text-center">
        <div className="bg-destructive/10 flex h-16 w-16 items-center justify-center rounded-full">
          <XCircle className="text-destructive h-8 w-8" />
        </div>

        <p className="text-muted-foreground text-sm">
          The verification link you used is invalid. It may have been modified or already used.
          Please request a new link.
        </p>

        <div className="w-full space-y-3">
          <Button asChild className="w-full">
            <Link to="/auth/check-email">Request a new link</Link>
          </Button>

          <p className="text-muted-foreground text-center text-sm">
            <Link
              to="/login"
              className="hover:text-primary font-medium underline underline-offset-4"
            >
              Back to sign in
            </Link>
          </p>
        </div>
      </div>
    </AuthCard>
  );
}
