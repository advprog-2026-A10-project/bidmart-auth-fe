import { Link } from "react-router";
import { Button } from "~/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/shared/components/ui/card";

export function SecurityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Security</h2>
        <p className="text-muted-foreground">Manage your account security settings.</p>
      </div>
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>Change your account password.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" size="sm">
              <Link to="/settings/security/password">Change password</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Sessions</CardTitle>
            <CardDescription>View and manage your active login sessions.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" size="sm">
              <Link to="/settings/security/sessions">Manage sessions</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Multi-Factor Authentication</CardTitle>
            <CardDescription>Add an extra layer of security to your account.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" size="sm">
              <Link to="/settings/security/mfa">Manage MFA</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
