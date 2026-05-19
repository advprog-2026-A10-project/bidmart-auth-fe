import { Link, useSearchParams } from "react-router";
import { AuthCard } from "../components/auth-card";
import { Button } from "~/shared/components/ui/button";
import {
  appendRedirectParam,
  resolvePostAuthRedirect,
} from "~/modules/auth/presentation/redirect-target";

export function MfaOfferPage() {
  const [searchParams] = useSearchParams();
  const redirectTarget = resolvePostAuthRedirect(searchParams.get("redirect"));

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
          <Link to={appendRedirectParam("/settings/security/mfa", redirectTarget)}>
            Go to security settings
          </Link>
        </Button>
        <Button asChild className="w-full" variant="outline">
          <a href={redirectTarget}>Continue to application</a>
        </Button>
      </div>
    </AuthCard>
  );
}
