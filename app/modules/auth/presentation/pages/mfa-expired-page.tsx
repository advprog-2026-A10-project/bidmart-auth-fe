import { Link } from "react-router";
import { AuthCard } from "../components/auth-card";
import { Button } from "~/shared/components/ui/button";

export function MfaExpiredPage() {
  return (
    <AuthCard title="Code expired" description="Your MFA code has expired.">
      <div className="space-y-4">
        <p className="text-muted-foreground text-center text-sm">
          Please log in again to request a new code.
        </p>
        <Button asChild className="w-full">
          <Link to="/login">Back to sign in</Link>
        </Button>
      </div>
    </AuthCard>
  );
}
