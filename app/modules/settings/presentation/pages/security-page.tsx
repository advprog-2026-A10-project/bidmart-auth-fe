import { Link } from "react-router";
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
            <Link
              to="/settings/security/password"
              className="hover:text-primary text-sm font-medium underline underline-offset-4"
            >
              Change password →
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Sessions</CardTitle>
            <CardDescription>View and manage your active login sessions.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              to="/settings/security/sessions"
              className="hover:text-primary text-sm font-medium underline underline-offset-4"
            >
              Manage sessions →
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Two-Factor Authentication</CardTitle>
            <CardDescription>Add an extra layer of security to your account.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              to="/settings/security/mfa"
              className="hover:text-primary text-sm font-medium underline underline-offset-4"
            >
              Manage 2FA →
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
