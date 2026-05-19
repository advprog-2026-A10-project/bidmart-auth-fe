import { useNavigate, useSearchParams } from "react-router";
import { AuthCard } from "../components/auth-card";
import { LoginForm } from "../components/login-form";
import type { LoginFormValues } from "../components/login-form";
import { useLoginMutation } from "../hooks/use-login-mutation";
import { MfaRequiredError } from "~/modules/auth/domain/errors/auth-errors";
import { storeMfaTicket } from "../mfa-ticket-storage";
import {
  appendRedirectParam,
  resolvePostAuthRedirect,
} from "~/modules/auth/presentation/redirect-target";

export function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const loginMutation = useLoginMutation();
  const redirectTarget = resolvePostAuthRedirect(searchParams.get("redirect"));

  async function handleSubmit(values: LoginFormValues) {
    try {
      await loginMutation.mutateAsync({ email: values.email, password: values.password });
      void navigate(appendRedirectParam("/auth/mfa/offer", redirectTarget));
    } catch (error) {
      if (error instanceof MfaRequiredError) {
        const state = { ticket: error.ticket, mfaType: error.mfaType, redirectTarget };
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
