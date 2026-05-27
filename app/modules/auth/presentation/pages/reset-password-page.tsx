import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { AuthCard } from "../components/auth-card";
import { ResetPasswordForm, type ResetPasswordFormValues } from "../components/reset-password-form";
import { useResetPasswordMutation } from "../hooks/use-reset-password-mutation";
import {
  InvalidResetTokenError,
  MfaExpiredError,
  TokenExpiredError,
} from "~/modules/auth/domain/errors/auth-errors";

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const resetPasswordMutation = useResetPasswordMutation();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      void navigate("/auth/reset-password/invalid", { replace: true });
    }
  }, [navigate, token]);

  if (!token) return null;
  const resetToken = token;

  async function handleSubmit(values: ResetPasswordFormValues) {
    try {
      await resetPasswordMutation.mutateAsync({
        token: resetToken,
        password: values.password,
      });
      void navigate("/auth/reset-password/success");
    } catch (error) {
      if (error instanceof TokenExpiredError || error instanceof MfaExpiredError) {
        void navigate("/auth/reset-password/expired");
        return;
      }

      if (error instanceof InvalidResetTokenError || error instanceof Error) {
        void navigate("/auth/reset-password/invalid");
      }
    }
  }

  return (
    <AuthCard title="Reset password" description="Choose a new password for your account.">
      <ResetPasswordForm onSubmit={handleSubmit} isSubmitting={resetPasswordMutation.isPending} />
    </AuthCard>
  );
}
