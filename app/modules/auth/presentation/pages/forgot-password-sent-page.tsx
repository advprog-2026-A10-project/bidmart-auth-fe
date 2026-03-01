import { Link } from "react-router";
import { AuthCard } from "../components/auth-card";
import { Button } from "~/shared/components/ui/button";

export function ForgotPasswordSentPage() {
  return (
    <AuthCard
      title="Check your email"
      description="We've sent a password reset link to your email address."
    >
      <div className="space-y-4 text-center">
        <p className="text-muted-foreground text-sm">
          Didn&apos;t receive it? Check your spam folder or try again.
        </p>
        <Button asChild className="w-full" variant="outline">
          <Link to="/forgot-password">Try again</Link>
        </Button>
        <p className="text-muted-foreground text-sm">
          <Link to="/login" className="hover:text-primary font-medium underline underline-offset-4">
            Back to sign in
          </Link>
        </p>
      </div>
    </AuthCard>
  );
}
