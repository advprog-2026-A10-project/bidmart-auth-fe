import { Link } from "react-router";
import { AuthCard } from "../components/auth-card";
import { Button } from "~/shared/components/ui/button";

export function MfaOfferPage() {
  return (
    <AuthCard
      title="Secure your account"
      description="Set up multi-factor authentication to protect your account."
    >
      <div className="space-y-4 text-center">
        <p className="text-muted-foreground text-sm">
          You can enable MFA from your account settings.
        </p>
        <Button asChild className="w-full">
          <Link to="/settings/security">Go to security settings</Link>
        </Button>
        <p className="text-muted-foreground text-sm">
          <Link to="/posts" className="hover:text-primary font-medium underline underline-offset-4">
            Skip for now
          </Link>
        </p>
      </div>
    </AuthCard>
  );
}
