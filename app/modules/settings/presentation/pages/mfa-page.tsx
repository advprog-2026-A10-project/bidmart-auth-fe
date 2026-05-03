import { Link } from "react-router";
import { Button } from "~/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/shared/components/ui/card";
import { useGetMfaStatusQuery } from "../hooks/use-get-mfa-status-query";

export function MfaPage() {
  const { data, isLoading, isError, error } = useGetMfaStatusQuery();
  const mfaEnabled = Boolean(data?.mfaEnabled);
  const enabledMethod = data?.mfaType === "totp" ? "an authenticator app" : "email";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Multi-Factor Authentication</h2>
        <p className="text-muted-foreground">Add an extra layer of security to your account.</p>
      </div>

      {isLoading ? <p className="text-muted-foreground text-sm">Loading MFA status...</p> : null}
      {isError ? (
        <p className="text-destructive text-sm">
          {error instanceof Error ? error.message : "Unable to load MFA status."}
        </p>
      ) : null}

      {!isLoading && !isError && !mfaEnabled ? (
        <Card>
          <CardHeader>
            <CardTitle>MFA not enabled</CardTitle>
            <CardDescription>
              Choose a method to set up multi-factor authentication.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="outline">
              <Link to="/settings/security/mfa/totp/setup">Set up Authenticator App</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/settings/security/mfa/email/setup">Set up Email MFA</Link>
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {!isLoading && !isError && mfaEnabled ? (
        <Card>
          <CardHeader>
            <CardTitle>MFA Enabled</CardTitle>
            <CardDescription>Your account is protected with {enabledMethod} MFA.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="outline" size="sm">
              <Link to="/settings/security/mfa/disable">Go to disable flow</Link>
            </Button>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
