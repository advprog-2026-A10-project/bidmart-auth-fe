import { useSearchParams, useNavigate, Link } from "react-router";
import { AuthCard } from "../components/auth-card";
import { ResetPasswordForm, type ResetPasswordFormValues } from "../components/reset-password-form";
import { AUTH_PAGE_MOCK_PAYLOADS } from "./constant";

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const resetPasswordMock = AUTH_PAGE_MOCK_PAYLOADS.resetPassword;
  const token = searchParams.get("token") ?? resetPasswordMock.request.token;

  if (!token) {
    return (
      <AuthCard title="Error" description="No reset token found in mock request payload.">
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
    const request = { ...resetPasswordMock.request, token, password: values.password };
    void request;
    void navigate("/reset-password/success");
  }

  return (
    <AuthCard
      title="Reset password"
      description="Placeholder reset-password using mock payload contract."
    >
      <ResetPasswordForm onSubmit={handleSubmit} isSubmitting={false} />
    </AuthCard>
  );
}
