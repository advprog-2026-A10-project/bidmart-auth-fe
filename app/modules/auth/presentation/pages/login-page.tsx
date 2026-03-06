import { useNavigate } from "react-router";
import { AuthCard } from "../components/auth-card";
import { LoginForm } from "../components/login-form";
import type { LoginFormValues } from "../components/login-form";
import { AUTH_PAGE_MOCK_PAYLOADS } from "./constant";

export function LoginPage() {
  const navigate = useNavigate();
  const loginMock = AUTH_PAGE_MOCK_PAYLOADS.login;

  function handleSubmit(_values: LoginFormValues) {
    void navigate(loginMock.response.success.emailVerified ? "/posts" : "/verify-email");
  }

  return (
    <AuthCard title="Sign in" description="Placeholder login using mock request/response payloads.">
      <LoginForm onSubmit={handleSubmit} isSubmitting={false} />
    </AuthCard>
  );
}
