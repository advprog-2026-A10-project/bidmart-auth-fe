import { useNavigate } from "react-router";
import { AuthCard } from "../components/auth-card";
import { RegisterForm } from "../components/register-form";
import type { RegisterFormValues } from "../components/register-form";
import { AUTH_PAGE_MOCK_PAYLOADS } from "./constant";

export function RegisterPage() {
  const navigate = useNavigate();
  const registerMock = AUTH_PAGE_MOCK_PAYLOADS.register;

  function handleSubmit(values: RegisterFormValues) {
    const request = registerMock.request;
    void request;
    void navigate(`/verify-email?email=${encodeURIComponent(values.email)}`);
  }

  return (
    <AuthCard
      title="Create an account"
      description="Placeholder registration using mock request/response payloads."
    >
      <RegisterForm onSubmit={handleSubmit} isSubmitting={false} />
    </AuthCard>
  );
}
