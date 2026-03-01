import { useNavigate } from "react-router";
import { AuthCard } from "../components/auth-card";
import { LoginForm } from "../components/login-form";
import { useLoginMutation } from "../hooks/use-login-mutation";
import { MfaRequiredError } from "~/modules/auth/domain/errors/auth-errors";
import type { LoginFormValues } from "../components/login-form";

export function LoginPage() {
  const navigate = useNavigate();
  const login = useLoginMutation();

  function handleSubmit(values: LoginFormValues) {
    login.mutate(
      { email: values.email, password: values.password },
      {
        onSuccess: () => navigate("/posts"),
        onError: (error) => {
          if (error instanceof MfaRequiredError) {
            void navigate("/mfa", {
              state: { ticket: error.ticket, mfaType: error.mfaType },
            });
          }
        },
      },
    );
  }

  return (
    <AuthCard title="Sign in" description="Enter your credentials to access your account.">
      <LoginForm onSubmit={handleSubmit} isSubmitting={login.isPending} />
    </AuthCard>
  );
}
