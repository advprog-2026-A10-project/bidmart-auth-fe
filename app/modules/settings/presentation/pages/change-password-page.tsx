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
import { useChangePasswordMutation } from "../hooks/use-change-password-mutation";

export function ChangePasswordPage() {
  const changePassword = useChangePasswordMutation();

  const handleSubmit = async (values: ChangePasswordFormValues) => {
    await changePassword.mutateAsync({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    });
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
          <ChangePasswordForm onSubmit={handleSubmit} isSubmitting={changePassword.isPending} />
        </CardContent>
      </Card>
    </div>
  );
}
