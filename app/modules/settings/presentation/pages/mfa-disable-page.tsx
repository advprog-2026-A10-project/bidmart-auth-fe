import { useNavigate } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/shared/components/ui/card";
import { useDisableMfaMutation } from "../hooks/use-disable-mfa-mutation";
import { DisableMfaForm } from "../components/disable-mfa-form";
import type { DisableMfaFormValues } from "../components/disable-mfa-form";

export function MfaDisablePage() {
  const navigate = useNavigate();
  const disableMfa = useDisableMfaMutation();

  function handleSubmit(values: DisableMfaFormValues) {
    disableMfa.mutate(
      { password: values.password },
      { onSuccess: () => navigate("/settings/security/mfa") },
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Disable Two-Factor Authentication</h2>
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
