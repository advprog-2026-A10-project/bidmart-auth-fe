import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/shared/components/ui/card";
import {
  ChangePasswordForm,
  type ChangePasswordFormValues,
} from "../components/change-password-form";
import { SETTINGS_PAGE_MOCK_PAYLOADS } from "./constant";
import { useState } from "react";

export function ChangePasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubmit = async (values: ChangePasswordFormValues) => {
    setIsSubmitting(true);
    const request = {
      ...SETTINGS_PAGE_MOCK_PAYLOADS.changePassword.request.change,
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    };
    void request;
    setFeedback(SETTINGS_PAGE_MOCK_PAYLOADS.changePassword.response.success.message);
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Change Password</h2>
        <p className="text-muted-foreground">Update your account password.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>New Password</CardTitle>
          <CardDescription>Enter your current password and choose a new one.</CardDescription>
        </CardHeader>
        <CardContent>
          {feedback ? (
            <p className="mb-4 text-sm font-medium" role="status" aria-live="polite">
              {feedback}
            </p>
          ) : null}
          <ChangePasswordForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </CardContent>
      </Card>
    </div>
  );
}
