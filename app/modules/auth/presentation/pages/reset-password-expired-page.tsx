import { Link } from "react-router";
import { AuthCard } from "../components/auth-card";
import { Button } from "~/shared/components/ui/button";

export function ResetPasswordExpiredPage() {
  return (
    <AuthCard title="Link expired" description="This password reset link has expired.">
      <div className="space-y-4">
        <Button asChild className="w-full">
          <Link to="/forgot-password">Request a new link</Link>
        </Button>
        <p className="text-muted-foreground text-center text-sm">
          <Link to="/login" className="hover:text-primary font-medium underline underline-offset-4">
            Back to sign in
          </Link>
        </p>
      </div>
    </AuthCard>
  );
}
