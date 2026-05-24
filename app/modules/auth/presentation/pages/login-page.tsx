import { useNavigate, useSearchParams } from "react-router";
import { AuthCard } from "../components/auth-card";
import { LoginForm } from "../components/login-form";
import type { LoginFormValues } from "../components/login-form";
import { useLoginMutation } from "../hooks/use-login-mutation";
import {
  EmailNotVerifiedError,
  MfaRequiredError,
} from "~/modules/auth/domain/errors/auth-errors";
import { storeMfaTicket } from "~/modules/auth/infrastructure/storage/mfa-ticket-storage";
import {
  appendRedirectParam,
  resolvePostAuthRedirect,
} from "~/modules/auth/infrastructure/navigation/redirect-target";

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
        void navigate(appendRedirectParam("/auth/mfa", redirectTarget), { state });
        return;
      }

      if (error instanceof EmailNotVerifiedError) {
        const email = values.email.trim();
        void navigate(`/auth/check-email?email=${encodeURIComponent(email)}`);
      }
    }
  }

  return (
    <AuthCard title="Sign in" description="Enter your credentials to access your account.">
      <LoginForm onSubmit={handleSubmit} isSubmitting={loginMutation.isPending} />
    </AuthCard>
  );
}
