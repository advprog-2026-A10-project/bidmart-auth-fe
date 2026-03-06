import { useNavigate } from "react-router";
import { AuthCard } from "../components/auth-card";
import {
  ForgotPasswordForm,
  type ForgotPasswordFormValues,
} from "../components/forgot-password-form";
import { AUTH_PAGE_MOCK_PAYLOADS } from "./constant";

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const forgotPasswordMock = AUTH_PAGE_MOCK_PAYLOADS.forgotPassword;

  function handleSubmit(values: ForgotPasswordFormValues) {
    const request = { ...forgotPasswordMock.request, email: values.email };
    void request;
    void navigate("/forgot-password/sent");
  }

  return (
    <AuthCard
      title="Forgot password?"
      description="Placeholder forgot-password flow using mock request/response payloads."
    >
      <ForgotPasswordForm onSubmit={handleSubmit} isSubmitting={false} />
    </AuthCard>
  );
}
