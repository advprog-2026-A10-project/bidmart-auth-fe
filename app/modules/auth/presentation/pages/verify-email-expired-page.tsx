import { Link } from "react-router";
import { Clock } from "lucide-react";
import { AuthCard } from "../components/auth-card";
import { Button } from "~/shared/components/ui/button";

/**
 * VerifyEmailExpiredPage — 1.1.5.
 * Shown when the verification link has expired (token older than 30 seconds).
 */
export function VerifyEmailExpiredPage() {
  return (
    <AuthCard title="Link expired" description="Your verification link is no longer valid.">
      <div className="flex flex-col items-center gap-6 py-2 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
          <Clock className="h-8 w-8 text-amber-600" />
        </div>

        <p className="text-muted-foreground text-sm">
          Verification links expire after 30 seconds. Request a new link to complete your
          registration.
        </p>

        <div className="w-full space-y-3">
          <Button asChild className="w-full">
            <Link to="/check-email">Request a new link</Link>
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
