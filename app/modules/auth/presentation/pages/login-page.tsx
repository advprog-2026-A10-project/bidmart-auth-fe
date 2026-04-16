import { useNavigate } from "react-router";
import { AuthCard } from "../components/auth-card";
import { LoginForm } from "../components/login-form";
import type { LoginFormValues } from "../components/login-form";
import { useLoginMutation } from "../hooks/use-login-mutation";
import { MfaRequiredError } from "~/modules/auth/domain/errors/auth-errors";
import { storeMfaTicket } from "../mfa-ticket-storage";

export function LoginPage() {
  const navigate = useNavigate();
  const loginMutation = useLoginMutation();

  async function handleSubmit(values: LoginFormValues) {
    try {
      await loginMutation.mutateAsync({ email: values.email, password: values.password });
      void navigate("/posts");
    } catch (error) {
      if (error instanceof MfaRequiredError) {
        const state = { ticket: error.ticket, mfaType: error.mfaType };
        storeMfaTicket(state);
        void navigate("/auth/mfa", { state });
      }
    }
  }

  return (
    <AuthCard title="Sign in" description="Enter your credentials to access your account.">
      <LoginForm onSubmit={handleSubmit} isSubmitting={loginMutation.isPending} />
    </AuthCard>
  );
}
