import { toast } from "sonner";
import { Link } from "react-router";
import { Button } from "~/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/shared/components/ui/card";
import { SETTINGS_PAGE_MOCK_PAYLOADS } from "./constant";
import { useState } from "react";

export function MfaPage() {
  const [data, setData] = useState(SETTINGS_PAGE_MOCK_PAYLOADS.security.response.mfaStatus);

  function handleDisableMfa() {
    setData({ mfaEnabled: false, mfaType: null });
    toast.success(SETTINGS_PAGE_MOCK_PAYLOADS.mfaDisable.response.success.message);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Multi-Factor Authentication</h2>
        <p className="text-muted-foreground">Add an extra layer of security to your account.</p>
      </div>
      {!data.mfaEnabled ? (
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
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>MFA Enabled</CardTitle>
            <CardDescription>
              Your account is protected with{" "}
              {data.mfaType === "totp" ? "an authenticator app" : "email"} MFA.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="outline" size="sm">
              <Link to="/settings/security/mfa/disable">Go to disable flow</Link>
            </Button>
            <Button variant="destructive" size="sm" onClick={handleDisableMfa}>
              Disable now (mock)
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
