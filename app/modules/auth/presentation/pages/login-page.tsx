import { useNavigate } from "react-router";
import { AuthCard } from "../components/auth-card";
import { LoginForm } from "../components/login-form";
import type { LoginFormValues } from "../components/login-form";
import { AUTH_PAGE_MOCK_PAYLOADS } from "./constant";

export function LoginPage() {
  const navigate = useNavigate();
  const loginMock = AUTH_PAGE_MOCK_PAYLOADS.login;

  function handleSubmit(values: LoginFormValues) {
    const request = { ...loginMock.request, email: values.email, password: values.password };
    void request;

    if (loginMock.response.success.emailVerified) {
      void navigate("/posts");
      return;
    }

    void navigate("/check-email");
  }

  return (
    <AuthCard title="Sign in" description="Enter your credentials to access your account.">
      <LoginForm onSubmit={handleSubmit} isSubmitting={false} />
    </AuthCard>
  );
}
