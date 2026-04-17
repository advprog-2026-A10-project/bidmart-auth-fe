import { useNavigate } from "react-router";
import { AuthCard } from "../components/auth-card";
import {
  ForgotPasswordForm,
  type ForgotPasswordFormValues,
} from "../components/forgot-password-form";
import { useForgotPasswordMutation } from "../hooks/use-forgot-password-mutation";

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const forgotPasswordMutation = useForgotPasswordMutation();

  async function handleSubmit(values: ForgotPasswordFormValues) {
    await forgotPasswordMutation.mutateAsync({ email: values.email });
    void navigate("/forgot-password/sent");
  }

  return (
    <AuthCard title="Forgot password?" description="Enter your email to receive a reset link.">
      <ForgotPasswordForm onSubmit={handleSubmit} isSubmitting={forgotPasswordMutation.isPending} />
    </AuthCard>
  );
}
