import { Link } from "react-router";
import { useGetMfaStatusQuery } from "../hooks/use-get-mfa-status-query";
import { Button } from "~/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/shared/components/ui/card";
import { Skeleton } from "~/shared/components/ui/skeleton";

export default function MfaPage() {
  const { data, isLoading, isError } = useGetMfaStatusQuery();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-[200px] w-full rounded-xl" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="bg-destructive/10 text-destructive rounded-md p-4">
        Failed to load MFA status.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Two-Factor Authentication</h2>
        <p className="text-muted-foreground">Add an extra layer of security to your account.</p>
      </div>

      {!data.mfaEnabled ? (
        <Card>
          <CardHeader>
            <CardTitle>MFA not enabled</CardTitle>
            <CardDescription>Choose a method to set up two-factor authentication.</CardDescription>
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
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>MFA Enabled</CardTitle>
            <CardDescription>
              Your account is protected with{" "}
              {data.mfaType === "totp" ? "an authenticator app" : "email"} MFA.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              to="/settings/security/mfa/disable"
              className="text-destructive text-sm font-medium underline underline-offset-4 hover:opacity-80"
            >
              Disable MFA
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
