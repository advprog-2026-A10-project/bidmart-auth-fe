import { useSearchParams, useNavigate, Link } from "react-router";
import { AuthCard } from "../components/auth-card";
import { ResetPasswordForm, type ResetPasswordFormValues } from "../components/reset-password-form";
import { useResetPasswordMutation } from "../hooks/use-reset-password-mutation";
import {
  TokenExpiredError,
  InvalidResetTokenError,
} from "~/modules/auth/domain/errors/auth-errors";

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const mutation = useResetPasswordMutation();

  if (!token) {
    return (
      <AuthCard title="Error" description="No reset token found.">
        <div className="text-center">
          <Link
            to="/forgot-password"
            className="hover:text-primary text-sm font-medium underline underline-offset-4"
          >
            Request a new link
          </Link>
        </div>
      </AuthCard>
    );
  }

  function handleSubmit(values: ResetPasswordFormValues) {
    mutation.mutate(
      { token: token as string, password: values.password },
      {
        onSuccess: () => navigate("/reset-password/success"),
        onError: (error) => {
          if (error instanceof TokenExpiredError) {
            navigate("/reset-password/expired");
          } else if (error instanceof InvalidResetTokenError) {
            navigate("/reset-password/invalid");
          }
        },
      },
    );
  }

  return (
    <AuthCard title="Reset password" description="Enter a new password for your account.">
      <ResetPasswordForm onSubmit={handleSubmit} isSubmitting={mutation.isPending} />
    </AuthCard>
  );
}
