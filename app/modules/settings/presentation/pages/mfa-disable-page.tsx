import { toast } from "sonner";
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
import { SETTINGS_PAGE_MOCK_PAYLOADS } from "./constant";
import { useState } from "react";

export function MfaDisablePage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(values: DisableMfaFormValues) {
    setIsSubmitting(true);
    const request = {
      ...SETTINGS_PAGE_MOCK_PAYLOADS.mfaDisable.request.disable,
      password: values.password,
    };
    void request;
    toast.success(SETTINGS_PAGE_MOCK_PAYLOADS.mfaDisable.response.success.message);
    setIsSubmitting(false);
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
          <DisableMfaForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </CardContent>
      </Card>
    </div>
  );
}
