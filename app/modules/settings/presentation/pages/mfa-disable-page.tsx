import { useNavigate } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/shared/components/ui/card";
import { DisableMfaForm } from "../components/disable-mfa-form";
import type { DisableMfaFormValues } from "../components/disable-mfa-form";
import { useDisableMfaMutation } from "../hooks/use-disable-mfa-mutation";

export function MfaDisablePage() {
  const navigate = useNavigate();
  const disableMfa = useDisableMfaMutation();

  async function handleSubmit(values: DisableMfaFormValues) {
    await disableMfa.mutateAsync({ currentPassword: values.currentPassword });
    void navigate("/settings/security/mfa");
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Disable Multi-Factor Authentication</h2>
        <p className="text-muted-foreground text-sm">
          Enter your password to confirm disabling MFA.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Confirm</CardTitle>
          <CardDescription>
            This will remove the extra security layer from your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DisableMfaForm onSubmit={handleSubmit} isSubmitting={disableMfa.isPending} />
        </CardContent>
      </Card>
    </div>
  );
}
