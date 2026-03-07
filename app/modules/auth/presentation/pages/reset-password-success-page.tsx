import { Link } from "react-router";
import { AuthCard } from "../components/auth-card";
import { Button } from "~/shared/components/ui/button";

export function ResetPasswordSuccessPage() {
  return (
    <AuthCard title="Password reset!" description="Your password has been updated.">
      <div className="space-y-4">
        <Button asChild className="w-full">
          <Link to="/login">Sign in</Link>
        </Button>
      </div>
    </AuthCard>
  );
}
